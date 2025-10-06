import mongoose from "mongoose";


const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    status: { type: String, enum: ["pending", "in-progress", "completed"],required : true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    // priority: {type:String,enum: ["low", "medium", "high"]},
    // members: [projectMemberSchema],
  },
  { timestamps: true }
);

const projectMemberSchema = new mongoose.Schema(
    {
      projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["owner", "manager", "developer", "tester"], default: "developer", },
      joinedAt: { type: Date, default: Date.now },
    },
    { _id: false }
  );

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
      enum: ["manager", "developer", "tester"],
      default: "developer",
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    invitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

projectInviteSchema.index({ projectId: 1, email: 1 }, { unique: true });

const ProjectInvite = mongoose.model("ProjectInvite", projectInviteSchema);
const Project = mongoose.model("Project", projectSchema);
const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

export {Project,ProjectMember,ProjectInvite};
