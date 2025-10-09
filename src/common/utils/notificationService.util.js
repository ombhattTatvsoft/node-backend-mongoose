import Notification from "../../modules/notification/notification.schema.js";
import { io } from "../../server.js";

export const sendNotification = async ({ userId, projectId, type, message }) => {
  const notification = await Notification.create({ userId, projectId, type, message });
  // Emit to the user room
  io.to(String(userId)).emit("newNotification", notification);
  return notification;
};
