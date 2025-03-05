import { UserModel } from "src/user/entities/user.model";

export class PostModel {

    id: string;

    title: string;
    
    body: string;

    user: UserModel;

    createdAt: Date;

    updatedAt: Date;

    constructor(data?: Partial<PostModel>){
        if (data) {
            Object.assign(this, data);
        }
    }
}
