import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/resources/user/user.service';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { UserRole } from 'src/resources/user/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashed,
      role: UserRole.USER,
    });
    return this.createToken(user.id, user.email, user.role);
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
    return this.createToken(user.id, user.email, user.role);
  }

  private createToken(id: number, email: string, role: string) {
    const payload = { sub: id, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
