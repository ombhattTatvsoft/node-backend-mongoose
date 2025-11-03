import * as taskService from "./task.service.js";
import { success } from "../../common/utils/response.js";

export const createTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    const files = req.files;
    const task = await taskService.createTask(userId, data, files);
    success({ res, status: 201, message: "Task created successfully", data: { task } });
  } catch (err) {
    next(err);
  }
};

export const editTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    const files = req.files;
    const task = await taskService.editTask(userId, data, files);
    success({ res, message: "Task updated successfully", data: { task } });
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.params;
    const tasks = await taskService.getTasks(userId,projectId);
    success({ res, data: { tasks } });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;
    const task = await taskService.getTask(taskId, userId);
    success({ res, data: { task } });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id, status } = req.body;
    const task = await taskService.updateTaskStatus(userId, id, status);
    success({ res, message: "Task status updated successfully", data: { task } });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    await taskService.deleteTask(userId, id);
    success({ res, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const saveTaskAttachments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { taskId, deletedFilenames } = req.body;
    const files = req.files;
    await taskService.saveTaskAttachments(userId, taskId, files, deletedFilenames);
    success({
      res,
      message: "Attachments saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { taskId,text } = req.body;
    await taskService.addComment(req, taskId, text);
    success({ res });
  } catch (err) {
    next(err);
  }
};