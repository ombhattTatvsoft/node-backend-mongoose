import BaseRepo from "../../common/db-generic/base.repo.js";
import User from './user.model.js';

class UserRepo extends BaseRepo{
    constructor(){
        super(User);
    }
}
export default new UserRepo();