import BaseRepo from "../../common/db-generic/base.repo.js";
import Project from "./models/project.model.js";

class ProjectRepo extends BaseRepo {
  constructor() {
    super(Project);
  }
  async getProjectsWithMembers(query = {}) {
    const projects = await Project.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
        },
      },
      { $unwind: "$owner" },
      {
        $lookup: {
          from: "projectmembers",
          localField: "_id",
          foreignField: "projectId",
          as: "members",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
                pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
              },
            },
            { $unwind: "$user" },
            { $project: { role: 1, joinedAt: 1, user: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "projectinvites",
          localField: "_id",
          foreignField: "projectId",
          as: "pendingMembers",
          pipeline: [
            { $match : { status : "pending" }},
            { $project: { _id:0, email: 1, role: 1 } }
          ],
        },
      }
    ]);
    return projects;
  };
}
export default new ProjectRepo();
