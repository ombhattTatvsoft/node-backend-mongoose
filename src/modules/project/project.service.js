import mongoose from "mongoose";
import userRepo from "../user/user.repo.js";
import ProjectInvite from "./models/projectInvite.model.js";
import ProjectMember from "./models/projectMember.model.js";
import projectRepo from "./project.repo.js";
import config from "../../config/index.js";
import { sendEmail } from "../../common/utils/emailService.util.js";
import { format } from "date-fns";
import { sendNotification } from "../../common/utils/notificationService.util.js";

export const createProject = async (userId, data) => {
  const name = data.name.trim();
  const existing = await projectRepo.findOne({
    owner: userId,
    name: { $regex: `^${name}$`, $options: "i" },
  });
  if (existing)
    throw new Error("Project with this name already exists for this user");

  const project = await projectRepo.create({ ...data, owner: userId });
  await ProjectMember.create({ projectId: project._id, userId, role: "owner" });
  if (data.members.length)
    await syncProjectMembers(project, userId, data.members);
  return project;
};

export const getProjects = async (userId) => {
  userId = new mongoose.Types.ObjectId(userId);
  const myProjects = await projectRepo.getProjectsWithMembers({
    owner: userId,
  });
  const projects = await ProjectMember.find({ userId });
  const projectIds = projects.map((p) => p.projectId);
  const assignedProjects = await projectRepo.getProjectsWithMembers({
    _id: { $in: projectIds },
    owner: { $ne: userId },
  });
  return { myProjects, assignedProjects };
};

export const getProject = async (id) => {
  const project = await projectRepo.findById(id);
  if (!project) throw new Error("project not found");
  return project;
};

export const updateProject = async (data) => {
  const projectId = data._id;
  const members = data.members || [];

  const project = await projectRepo.findById(projectId);
  if (!project) throw new Error("Project not found");

  const name = data.name.trim();
  const duplicate = await projectRepo.findOne({
    owner: project.owner,
    name: { $regex: `^${name}$`, $options: "i" },
    _id: { $ne: projectId },
  });
  if (duplicate)
    throw new Error("Project with this name already exists for this user");

  const updatedProject = await projectRepo.updateById(projectId, {
    name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
  });

  await syncProjectMembers(updatedProject, project.owner, members);

  return updatedProject;
};

export const deleteProject = async (id) => {
  const existingProject = await projectRepo.findById(id);
  if (!existingProject) {
    throw new Error("project not found");
  }
  await ProjectMember.deleteMany({ id });
  await ProjectInvite.deleteMany({ id });
  return await projectRepo.deleteById(id);
};

async function syncProjectMembers(project, ownerId, members) {
  const projectId = project._id;
  const ownerStr = String(ownerId);
  if (!members.length) return;

  const inputEmails = members.map((m) => m.email.toLowerCase().trim());

  const registeredUsers = await userRepo.findAll(
    { email: { $in: inputEmails } },
    [],
    "_id email"
  );
  const emailToUserId = Object.fromEntries(
    registeredUsers.map((u) => [u.email, u._id])
  );

  const currentMembers = await ProjectMember.find({ projectId })
    .populate("userId", "_id email")
    .lean();
  const currentUserMap = Object.fromEntries(
    currentMembers.map((u) => [String(u.userId._id), u])
  );

  const pendingMembers = await ProjectInvite.find({ projectId }).lean();
  const pendingUserMap = Object.fromEntries(
    pendingMembers.map((u) => [u.email.toLowerCase(), u])
  );

  const membersToAdd = [];
  const membersToUpdate = [];
  const membersToRemoveIds = [];
  const invitesToAdd = [];
  const invitesToUpdate = [];
  const invitesToRemoveEmails = [];

  const emailsSet = new Set(inputEmails);

  members.forEach((m) => {
    const email = m.email.toLowerCase();
    const role = m.role;

    if (emailToUserId[email]) {
      const userId = String(emailToUserId[email]);
      if (currentUserMap[userId]) {
        if (currentUserMap[userId].role !== role) {
          membersToUpdate.push({
            updateOne: {
              filter: { projectId, userId },
              update: { $set: { role } },
            },
          });
        }
      } else {
        membersToAdd.push({ projectId, userId, role });
      }
    } else {
      if (pendingUserMap[email]) {
        if (pendingUserMap[email].role !== role) {
          invitesToUpdate.push({
            updateOne: {
              filter: { projectId, email },
              update: { $set: { role } },
            },
          });
        }
      } else {
        invitesToAdd.push({ projectId, email, role, invitedBy: ownerId });
      }
    }
  });

  currentMembers.forEach((m) => {
    const userIdStr = String(m.userId._id);
    if (userIdStr !== ownerStr && !emailsSet.has(m.userId.email)) {
      membersToRemoveIds.push(m._id);
    }
  });

  pendingMembers.forEach((p) => {
    if (!emailsSet.has(p.email.toLowerCase())) {
      invitesToRemoveEmails.push(p.email.toLowerCase());
    }
  });

  // Execute DB operations
  if (membersToAdd.length){
    await ProjectMember.insertMany(membersToAdd);
    for (const m of membersToAdd) {
      await sendNotification({
        userId: m.userId,
        projectId,
        type: "added",
        message: `You were added to project "${project.name}" as ${m.role}`,
      });
    }
  }
  if (membersToUpdate.length){
    await ProjectMember.bulkWrite(membersToUpdate);
    for (const update of membersToUpdate) {
      const { userId } = update.updateOne.filter;
      const { role } = update.updateOne.update.$set;
      await sendNotification({
        userId,
        projectId,
        type: "role_updated",
        message: `Your role in project "${project.name}" has been updated to ${role}`,
      });
    }
  };
  if (membersToRemoveIds.length){
    await ProjectMember.deleteMany({ _id: { $in: membersToRemoveIds } });
    for (const m of membersToRemoveIds) {
      await sendNotification({
        userId: m,
        projectId,
        type: "removed",
        message: `You have been removed from project "${project.name}"`,
      });
    }
  }

  if (invitesToAdd.length) {
    await ProjectInvite.insertMany(invitesToAdd);
    const owner = await userRepo.findOne({ _id : ownerId });
    await sendProjectInviteEmails({
      invites: invitesToAdd,
      project: {
        name: project.name,
        startDate: project.startDate,
        signupLink: `${config.cors.origin}/signup`,
      },
      invitedBy: owner.name,
    });
  }
  if (invitesToUpdate.length) await ProjectInvite.bulkWrite(invitesToUpdate);
  if (invitesToRemoveEmails.length)
    await ProjectInvite.deleteMany({ email: { $in: invitesToRemoveEmails } });
}

export async function sendProjectInviteEmails({ invites, project, invitedBy }) {
  if (!invites || invites.length === 0) return;

  const subject = `You're invited to join project "${project.name}"`;

  for (const invite of invites) {
    const { email, role } = invite;
    const startDate = project.startDate
      ? format(new Date(project.startDate), "PPP")
      : "TBD";

    const html = `
      <p>Hi,</p>
      <p>You have been invited to join the project <strong>${project.name}</strong> as <strong>${role}</strong>.</p>
      <p>Project start date: <strong>${startDate}</strong></p>
      <p>Please <a href="${project.signupLink}">sign up</a> to access the project and start collaborating.</p>
      <p>Invited by: ${invitedBy}</p>
      <p>Thank you!</p>
    `;

    const text = `
Hi,

You have been invited to join the project "${project.name}" as ${role}.
Project start date: ${startDate}

Please sign up using this link: ${project.signupLink}

Invited by: ${invitedBy}

Thank you!
    `;
    await sendEmail({ to: email, subject, html, text });
  }
}
