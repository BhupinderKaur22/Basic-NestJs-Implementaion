import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from "src/tasks/task.entity";
import { IsNotEmpty } from "class-validator";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    @IsNotEmpty()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    public async validatePassword(password): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}