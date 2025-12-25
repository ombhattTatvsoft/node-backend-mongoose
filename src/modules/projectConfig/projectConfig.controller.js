import { success } from "../../common/utils/response.js";
import * as projectConfigService from "./projectConfig.service.js";

export const getProjectConfig = async (req, res, next) => {
  try {
    const projectConfig = await projectConfigService.getProjectConfig(req.params.id);
    success({res,data:{projectConfig}})
  } catch (err) {
    next(err);
  }
};

export const updateTaskStages = async (req, res, next) => {
  try {
    const data = req.body;
    const projectConfig = await projectConfigService.updateTaskStages(data);
    success({res,data:{projectConfig}, message:"Task statuses updated successfully"})
  } catch (err) {
    next(err);
  }
};