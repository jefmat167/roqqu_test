import { Injectable } from "@nestjs/common";
import { AddressModel } from "src/address/entities/address.model";
import { PostModel } from "src/post/entities/post.model";

Injectable()
export class UserModel {

    id: string;

    name: string;

    email: string;

    phoneNumber: string;

    password: string;

    address: AddressModel;

    posts: PostModel[];

    createdAt: Date;

    updatedAt: Date;

    constructor(data?: Partial<UserModel>){
        if (data) {
            Object.assign(this, data);
        }
    }
}
