import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService
    ) {}


    public async signUp(authDto: AuthDto): Promise<void> {
        return this.authRepository.signUp(authDto);
    }


    public async signIn(authDto: AuthDto): Promise<{accessToken: string}> {
        const username = await this.authRepository.validateSignIn(authDto);
        
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
