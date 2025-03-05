import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("posts")
export class PostEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    title: string;

    @Column("text")
    body: string;

    @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
    @JoinColumn()
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(data?: Partial<PostEntity>){
        if (data) {
            Object.assign(this, data);
        }
    }
}
