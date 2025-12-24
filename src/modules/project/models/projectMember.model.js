import mongoose from "mongoose";
import { ProjectRoleEnum } from "../../../Const/enums.js";

const projectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ProjectRoleEnum),
      default: ProjectRoleEnum.DEVELOPER,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

projectMemberSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

projectMemberSchema.set('toObject', { virtuals: true });
projectMemberSchema.set('toJSON', { virtuals: true });

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);
export default ProjectMember;
