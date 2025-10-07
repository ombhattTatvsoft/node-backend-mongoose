import mongoose from "mongoose";
import userRepo from "../user/user.repo.js";
import ProjectInvite from "./models/projectInvite.model.js";
import ProjectMember from "./models/projectMember.model.js";
import projectRepo from "./project.repo.js";

export const createProject = async (userId, projectData) => {
  const existingProject = await projectRepo.findOne({
    owner: userId,
    name: { $regex: `^${projectData.name.trim()}$`, $options: "i" },
  });
  if (existingProject) {
    throw new Error("Project with this name already exists for this user");
  }

  const project = await projectRepo.create({
    ...projectData,
    owner: userId,
  });

  const membersToInsert = [{
    projectId: project._id,
    userId,
    role: "owner",
  }]
  const inputEmails = projectData.members.map((m) => m.email.toLowerCase().trim());
  const existingUsers = await userRepo.findAll({email : {$in : inputEmails}},[],"_id email");
  const existingEmails = existingUsers.map((u) => u.email);
  const existingUserMap = Object.fromEntries(existingUsers.map((u) => [u.email, u._id]));

  const invitesToInsert = [];
  for (const member of projectData.members) {
    const email = member.email.toLowerCase().trim();
    const role = member.role;

    if (existingEmails.includes(email)) {
      membersToInsert.push({
        projectId: project._id,
        userId: existingUserMap[email],
        role,
      });
    } else {
      invitesToInsert.push({
        projectId: project._id,
        email,
        role,
        invitedBy: userId,
      });
    }
  }

  if (membersToInsert.length > 0) {
    await ProjectMember.insertMany(membersToInsert);
  }

  if (invitesToInsert.length > 0) {
    await ProjectInvite.insertMany(invitesToInsert);
  }

  // Step 9 — Send one notification per group type
  // const notifiedUserIds = membersToInsert.map((m) => m.userId);
  // await sendProjectNotification(notifiedUserIds, `You were added to project "${project.name}"`);
  
  return project;
};

export const getProjects = async (userId) => {
  const myProjects =  await projectRepo.getProjectsWithMembers({owner : userId});
  const projects = await ProjectMember.find({userId}).distinct('projectId')
  const assignedProjects = await projectRepo.getProjectsWithMembers({_id : {$in : projects},owner: {$ne : userId}})
  return {myProjects,assignedProjects};
};

export const getProject = async (id) => {
  const project = await projectRepo.findById(id);
  if (!project) throw new Error("project not found");
  return project;
};

export const updateProject = async (id, data) => {
  const existingProject = await projectRepo.findById(id);
  if (!existingProject) {
    throw new Error("project not found");
  }
  const sameNameProject = await projectRepo.findOne({
    owner: existingProject.ownerId,
    name: { $regex: `^${projectData.name.trim()}$`, $options: "i" },
  });
  if (sameNameProject) {
    throw new Error("Project with this name already exists for this user");
  }
  return projectRepo.updateById(id, data);
};

export const deleteProject = async (id) => {
  const existingProject = await projectRepo.findById(id);
  if (!existingProject) {
    throw new Error("project not found");
  }
  return projectRepo.deleteById(id);
};
