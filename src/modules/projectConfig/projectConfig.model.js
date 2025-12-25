import mongoose from "mongoose";

const taskStages = new mongoose.Schema(
    {
        name: { type: String, required: true },
        order: { type: Number, required: true },
        isEditable: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    }
);
const projectConfigSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true,
        },
        TaskStages: [taskStages],
    }, 
    { timestamps: true }
);

const ProjectConfig = mongoose.model("ProjectConfig", projectConfigSchema);
export {ProjectConfig};