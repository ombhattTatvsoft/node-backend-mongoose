import projectRepo from "./project.repo.js";

export const createProject = async (userId,projectData) => {
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
  return await projectRepo.create(projectPayload);
};

export const getProjects = async (query) => {
  return await projectRepo.findAll(query);
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
