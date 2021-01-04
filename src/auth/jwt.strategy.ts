import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'MyBeautifulSecret'
        });
    }

    async validate(payload: JwtPayload) {
        const { username } = payload
        const user = await this.authRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}