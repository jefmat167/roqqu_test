import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("addresses")
export class AddressEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    street: string;

    @Column("text")
    city: string;

    @Column("text")
    state: string;

    @Column("text")
    country: string;

    @OneToOne(() => UserEntity, (user) => user.address)
    @JoinColumn()
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(data?: Partial<AddressEntity>){
        if (data) {
            Object.assign(this, data)
        }
    }
}
