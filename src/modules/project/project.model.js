import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["owner", "manager", "developer"], default: "developer", },
      joinedAt: { type: Date, default: Date.now },
    },
    { _id: false }
  );

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    status: { type: String, enum: ["pending", "in-progress", "completed"],required : true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    // priority: {type:String,enum: ["low", "medium", "high"]},
    members: [projectMemberSchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
