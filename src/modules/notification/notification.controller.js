import { success } from "../../common/utils/response.js";
import { io } from "../../server.js";
import Notification from "./notification.schema.js";

export const getNotifications = async (req, res ,next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId, read:false })
      .sort({ createdAt: -1 })
      .lean();
    success({res,message:'Notifications fetched successfully',data:{notifications}});
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    success({res,message:'All notifications marked as read'});
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

export const sendNotification = async ({userId, projectId, type, message}) => {
  const notification = await Notification.create({ userId, projectId, type, message });
  io.to(String(userId)).emit("newNotification", notification);
  return notification;
};
