import { Controller, Post, Body } from '@nestjs/common';
import { ApiProjectController } from 'src/shared/decorators/controller';
import { ApiProjectRoute } from 'src/shared/decorators/method';
import { AuthService } from './auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';

@ApiProjectController('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiProjectRoute({
    path: '/signup',
    method: 'POST',
    ok: { description: 'Sign up a new user' },
  })
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @ApiProjectRoute({
    path: '/login',
    method: 'POST',
    ok: { description: 'Login and get JWT' },
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
