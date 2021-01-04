import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    JwtModule.register({
      secret: 'MyBeautifulSecret',
      signOptions: {
        expiresIn: 3600
      }
    }),
    PassportModule.register({defaultStrategy: 'jwt'})
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
