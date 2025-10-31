import { success } from "../../common/utils/response.js";
import * as projectService from "./project.service.js";

export const createProject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const projectData = req.body;
    const project = await projectService.createProject(userId, projectData);
    success({
      res,
      status: 201,
      message: "Project created successfully",
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const projects = await projectService.getProjects(userId);
    success({ res, data: { projects } });
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id);
    success({res,data:{project}})
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.body);
    success({
      res,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    success({ res, message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// export const getProjectMembers = async (req, res, next) => {
//   try {
//     const projectId = req.params.id;
//     const allMembers = await projectService.getProjectMembers(projectId);
//     success({ res, data: { allMembers } });
//   } catch (err) {
//     next(err);
//   }
// };
