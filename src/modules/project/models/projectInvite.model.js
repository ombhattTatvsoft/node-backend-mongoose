import mongoose from "mongoose";
import { InvitationStatusEnum, ProjectRoleEnum } from "../../../Const/enums.js";

const projectInviteSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(ProjectRoleEnum),
      default: ProjectRoleEnum.DEVELOPER,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InvitationStatusEnum),
      default: InvitationStatusEnum.PENDING,
    },
    invitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
projectInviteSchema.index({ projectId: 1, email: 1 }, { unique: true });

const ProjectInvite = mongoose.model("ProjectInvite", projectInviteSchema);

export default ProjectInvite;
