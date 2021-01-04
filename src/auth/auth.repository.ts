import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthDto } from "./dto/auth.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    public async signUp(authDto: AuthDto): Promise<void> {
        const { username, password } = authDto;

        const authUser = new User();
        authUser.username = username;
        authUser.salt = await bcrypt.genSalt();
        authUser.password = await this.hashPasswords(password, authUser.salt);

        try {
            await authUser.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    public async hashPasswords(password, salt): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    public async validateSignIn(authDto: AuthDto): Promise<string> {
        const { username, password } = authDto;

        const usernameExists =await this.findOne({ username });
        if (usernameExists && await usernameExists.validatePassword(password)) {
            return username;
        } else {
            return null;
        }
    }

}