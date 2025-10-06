import { ProjectMember } from "./project.model.js";
import projectRepo from "./project.repo.js";

export const createProject = async (userId, projectData) => {
  const existingProject = await projectRepo.findOne({
    owner: userId,
    name: { $regex: `^${projectData.name.trim()}$`, $options: "i" },
  });
  if (existingProject) {
    throw new Error("Project with this name already exists for this user");
  }
  const projectPayload = {
    ...projectData,
    owner: userId,
  };
  const project = await projectRepo.create(projectPayload);
  await ProjectMember.create({
    projectId: project._id,
    userId,
    role: "owner",
  });
  for (const member of projectData.members) {
    const { email, role } = member;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await ProjectMember.create({
        projectId: project._id,
        userId: existingUser._id,
        role: role,
      });
    } else {
      await ProjectInvite.create({
        projectId: project._id,
        email,
        role: role,
        invitedBy: userId,
      });
    }
  }
  return project;
};

export const getProjects = async (query) => {
  return await projectRepo.findAll(query, [
    { path: "owner", select: "_id name email" },
    { path: "members.user", select: "_id name email" },
  ]);
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
