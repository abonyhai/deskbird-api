import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../../resources/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findByRefreshToken: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('access_token'),
    };
    jest.spyOn(bcrypt, 'hash').mockImplementation(async (v) => 'hashed-' + v);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (a, b) => a === b);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup should create user and return tokens', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (userService.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'a',
      role: 'user',
    });
    const result = await service.signup({
      email: 'a',
      password: 'b',
      fullName: 'c',
    });
    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBeDefined();
  });

  it('login should return tokens if credentials valid', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'a',
      password: 'b',
      role: 'user',
    });
    const result = await service.login({ email: 'a', password: 'b' });
    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBeDefined();
  });

  it('refresh should return new tokens if refresh token valid', async () => {
    (userService.findByRefreshToken as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'a',
      role: 'user',
    });
    (userService.update as jest.Mock).mockResolvedValue({});
    const result = await service.refresh('token');
    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBeDefined();
  });

  it('logout should revoke refresh token', async () => {
    (userService.findByRefreshToken as jest.Mock).mockResolvedValue({ id: 1 });
    (userService.update as jest.Mock).mockResolvedValue({});
    const result = await service.logout('token');
    expect(result.message).toBe('Logged out successfully');
  });
});
