import { UserModel } from "src/user/entities/user.model";

export class AddressModel {
    
    id: string;

    street: string;

    city: string;

    state: string;

    country: string;

    user: UserModel;

    createdAt: Date;

    updatedAt: Date;

    constructor(data?: Partial<AddressModel>){
        if (data) {
            Object.assign(this, data);
        }
    }
}
