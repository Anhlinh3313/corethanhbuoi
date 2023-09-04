import { GeneralModel } from "./general.model";
import { User } from "./user.model";


export class UserRelation extends GeneralModel{
    userId: number;
    userRelationId: number;

    user: User;
    userRelationUser: User;
}