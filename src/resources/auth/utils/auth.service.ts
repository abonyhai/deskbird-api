import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserService } from '../../user/user.service';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { UserRole } from '../../user/utils/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateRefreshToken(): Promise<string> {
    return randomBytes(64).toString('hex');
  }

  async signup(dto: SignupDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const refreshToken = await this.generateRefreshToken();
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashed,
      role: UserRole.USER,
      refreshToken: hashedRefresh,
    });

    const { access_token } = this.createToken(user.id, user.email, user.role);
    return {
      access_token,
      refresh_token: refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const refreshToken = await this.generateRefreshToken();
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(user.id, { refreshToken: hashedRefresh });

    const { access_token } = this.createToken(user.id, user.email, user.role);
    return {
      access_token,
      refresh_token: refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    // Find user by refresh token (compare hash)
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Issue new tokens
    const newRefreshToken = await this.generateRefreshToken();
    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
    await this.userService.update(user.id, { refreshToken: hashedRefresh });

    const { access_token } = this.createToken(user.id, user.email, user.role);
    return {
      access_token,
      refresh_token: newRefreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.userService.update(user.id, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private createToken(id: number, email: string, role: string) {
    const payload = { sub: id, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private sanitizeUser(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
