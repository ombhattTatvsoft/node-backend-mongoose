import fs from "fs";
import path from "path";
import ProjectMember from "../project/models/projectMember.model.js";
import Task from "./task.model.js";
import Project from "../project/models/project.model.js";
import { forbidden, notFound } from "../../common/utils/response.js";

const ATTACHMENT_DIR = path.join(process.cwd(), "uploads", "taskAttachments");

const findMember = (projectId, userId) =>
  ProjectMember.findOne({ projectId, userId });
const isOwner = (member) => member && member.role === "owner";
const isOwnerOrManager = (member) =>
  member && (member.role === "owner" || member.role === "manager");

const mapFilesToAttachments = (files, userId) =>
  files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/taskAttachments/${file.filename}`,
    uploadedBy: userId,
    uploadedAt: new Date(),
  }));

const deleteFilesFromDisk = (filenames = []) => {
  filenames.forEach((filename) => {
    const filePath = path.join(ATTACHMENT_DIR, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });
};

const canModifyTask = async (task, userId) => {
  const member = await findMember(task.projectId, userId);
  const isAssignee = task.assignee.toString() === userId.toString();
  return isOwnerOrManager(member) || isAssignee;
};

export const createTask = async (userId, data, files = []) => {
  const {
    projectId,
    title,
    description,
    status,
    priority,
    assignee,
    dueDate,
    tags,
  } = data;

  const member = await findMember(projectId, userId);
  if (!isOwnerOrManager(member))
    throw forbidden("You are not allowed to create task for this project");

  const formattedTags =
    typeof tags === "string" ? tags.trim().split(/,\s+/) : tags;
  const attachments = files.length ? mapFilesToAttachments(files, userId) : [];

  const newTask = await Task.create({
    projectId,
    title,
    description,
    status,
    priority,
    assignee,
    dueDate,
    tags: formattedTags,
    attachments,
    createdBy: userId,
    updatedBy: userId,
  });

  return newTask;
};

export const editTask = async (userId, data, files) => {
  const {
    _id,
    title,
    description,
    status,
    priority,
    assignee,
    dueDate,
    tags,
    deletedFilenames,
  } = data;

  const task = await Task.findById(_id);
  if (!task) throw notFound("Task not found");

  const member = await findMember(task.projectId, userId);
  if (!isOwnerOrManager(member)) throw forbidden("You are not allowed to edit this task");

  const formattedTags =
    typeof tags === "string" ? tags.trim().split(/\s+/) : tags;

    Object.assign(task, {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
      tags: formattedTags,
      updatedBy: userId,
    });

  if (files.length)
    task.attachments.push(...mapFilesToAttachments(files, userId));

  if (deletedFilenames?.length) {
    deleteFilesFromDisk(deletedFilenames);
    task.attachments = task.attachments.filter(
      (a) => !deletedFilenames.includes(a.filename)
    );
  }
  await task.save();
  return task;
};

export const getTasks = async (userId, projectId) => {
  const project = await Project.findById(projectId);
  if (!project) throw notFound("Project not found");

  const member = await findMember(projectId, userId);
  const filter = isOwnerOrManager(member)
    ? { projectId }
    : { projectId, assignee: userId };
  const tasks = await Task.find(filter)
    .populate("assignee", "_id name email")
    .populate("createdBy", "_id name email")
    .populate("updatedBy", "_id name email")
    .sort({ createdAt: -1 });

  return tasks;
};

export const updateTaskStatus = async (userId, taskId, newStatus) => {
  const task = await Task.findById(taskId);
  if (!task) throw notFound("Task not found");

  const member = await findMember(task.projectId, userId);
  const isAssignee = task.assignee.toString() === userId.toString();

  if (!isOwnerOrManager(member) && !isAssignee) {
    throw forbidden("You are not allowed to update the status of this task");
  }

  task.status = newStatus;
  task.updatedBy = userId;
  await task.save();

  return task;
};

export const deleteTask = async (userId, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw notFound("Task not found");

  const member = await findMember(task.projectId, userId);
  const isCreator = task.createdBy.toString() === userId.toString();

  if (!isOwner(member) && !isCreator) {
    throw forbidden("You are not allowed to delete this task");
  }
  deleteFilesFromDisk(task.attachments.map((a) => a.filename));
  await Task.findByIdAndDelete(taskId);
};

export const saveTaskAttachments = async (
  userId,
  taskId,
  files = [],
  deletedFilenames = []
) => {
  const task = await Task.findById(taskId);
  if (!task) throw notFound("Task not found");

  const allowed = await canModifyTask(task, userId);
  if (!allowed) throw forbidden("You are not allowed to modify attachments");

  if (deletedFilenames.length) {
    deleteFilesFromDisk(deletedFilenames);
    task.attachments = task.attachments.filter(
      (a) => !deletedFilenames.includes(a.filename)
    );
  }

  if (files.length) {
    task.attachments.push(...mapFilesToAttachments(files, userId));
  }

  task.updatedBy = userId;
  await task.save();

  return task;
};
