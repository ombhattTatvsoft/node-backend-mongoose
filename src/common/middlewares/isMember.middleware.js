import ProjectMember from "../../modules/project/models/projectMember.model.js";

export const isMember = async (req,res,next) => {
    try {
        const user = req.user;
        const projectId = req.params.id || req.params.projectId || req.body.projectId;
        const isMember = await ProjectMember.exists({projectId, userId: user._id});
        if (!isMember) {
            throw Error;
        }
        next();
    } catch (error) {
        return res.status(403).json({message: "Access denied. You are not a member of this project."});
    }
}