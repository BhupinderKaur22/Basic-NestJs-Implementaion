import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signUp')
    public signUp(@Body(ValidationPipe) authDto: AuthDto) {
        return this.authService.signUp(authDto);
    }

    @Post('/signIn')
    public signIn(@Body(ValidationPipe) authDto: AuthDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authDto);
    }
}
