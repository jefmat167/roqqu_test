import { AddressEntity } from "../../address/entities/address.entity";
import { PostEntity } from "../../post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column({unique: true, nullable: false, type: "varchar", length: 30})
    email: string;

    @Column({nullable: false, type: "varchar", length: 13})
    phoneNumber: string;

    @Column("text")
    password: string;

    @OneToOne(() => AddressEntity, (address) => address.user)
    address: AddressEntity;

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(data?: Partial<UserEntity>){
        if (data) {
            Object.assign(this, data);
        }
    }
}
