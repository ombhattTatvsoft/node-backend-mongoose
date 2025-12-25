import { badRequest, notFound } from "../../common/utils/response.js";
import { ProjectConfig } from "./projectConfig.model.js";
import { Task } from "../task/task.model.js";

export const createProjectConfig = async (project) => {
    await ProjectConfig.create({
        projectId: project._id,
        TaskStages: [
            { name: "To Do", order: 1, isEditable: false },
            { name: "In Progress", order: 2, isEditable: true },
            { name: "Completed", order: 3, isEditable: false },
        ],
    });
};

export const getProjectConfig = async (projectId) => {
    return await ProjectConfig.findOne({ projectId });
};

export const updateTaskStages = async (data) => {
    const projectConfig =  await ProjectConfig.findOne({ projectId: data.projectId });
    if (!projectConfig) {
        throw notFound("ProjectConfig not found");
    }
    const removedTaskStages = projectConfig.TaskStages.filter(stage =>
        !data.TaskStages.some(updatedStage => updatedStage._id?.toString() === stage._id.toString() && updatedStage.isActive));
    const newTaskStages = data.TaskStages.map((stage) => {
        if (!projectConfig.TaskStages.some(existingStage => existingStage._id?.toString() === stage._id?.toString())) {
            stage._id = undefined;
        }
        return stage;
    });
    const hasTaskInRemovedStage = await Task.findOne({ projectId: data.projectId, status: { $in: removedTaskStages.map(stage => stage._id) } });
    if (hasTaskInRemovedStage) {
        throw badRequest("Cannot remove status that has tasks associated with it");
    }
    projectConfig.TaskStages = newTaskStages;
    await projectConfig.save();
    return projectConfig;
};