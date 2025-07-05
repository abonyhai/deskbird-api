import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiProjectController } from 'src/shared/decorators/controller';
import { ApiProjectRoute } from 'src/shared/decorators/method';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.signup(dto);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    return {
      success: true,
      data: {
        token: access_token,
        user,
        refreshToken: refresh_token,
      },
    };
  }

  @ApiProjectRoute({
    path: '/login',
    method: 'POST',
    ok: { description: 'Login and get JWT' },
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(dto);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    return {
      success: true,
      data: {
        token: access_token,
        user,
        refreshToken: refresh_token,
      },
    };
  }

  @ApiProjectRoute({
    path: '/refresh',
    method: 'POST',
    ok: { description: 'Refresh access token using refresh token cookie' },
  })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const {
      access_token,
      refresh_token: newRefreshToken,
      user,
    } = await this.authService.refresh(refreshToken);
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    return {
      success: true,
      data: {
        token: access_token,
        user,
        refreshToken: newRefreshToken,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiProjectRoute({
    path: '/me',
    method: 'GET',
    ok: { description: 'Get current user information' },
  })
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = await this.authService.getCurrentUser(
      (req as any).user.userId,
    );
    return {
      success: true,
      data: user,
    };
  }

  @ApiProjectRoute({
    path: '/logout',
    method: 'POST',
    ok: { description: 'Logout and revoke refresh token' },
  })
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    const result = await this.authService.logout(refreshToken);
    return {
      success: true,
      data: result,
    };
  }
}
