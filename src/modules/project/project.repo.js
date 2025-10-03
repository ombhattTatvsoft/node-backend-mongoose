import BaseRepo from "../../common/db-generic/base.repo.js";
import Project from "./project.model.js";

class ProjectRepo extends BaseRepo{
    constructor(){
        super(Project);
    }
}
export default new ProjectRepo();