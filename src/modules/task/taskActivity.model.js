import mongoose from "mongoose";

const taskActivitySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "updated",
        "deleted",
        "statusChanged",
        "assigneeChanged",
        "dueDateChanged",
        "commented",
        "attachmentAdded",
        "attachmentRemoved",
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const TaskActivity = mongoose.model("TaskActivity", taskActivitySchema);
export default TaskActivity;
