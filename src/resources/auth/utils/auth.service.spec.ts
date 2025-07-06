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
      findOne: jest.fn(),
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

  it('signup should create user and return tokens with user data', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    };
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (userService.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.signup({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBeDefined();
    expect(result.user).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    });
  });

  it('signup should throw ConflictException if email exists', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(
      service.signup({
        email: 'test@example.com',
        password: 'pw',
        fullName: 'Test',
      }),
    ).rejects.toThrow('Email already in use');
  });

  it('login should return tokens with user data if credentials valid', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      fullName: 'Test User',
    };
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (userService.update as jest.Mock).mockResolvedValue({});

    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBeDefined();
    expect(result.user).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    });
  });

  it('login should throw UnauthorizedException if email not found', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(
      service.login({
        email: 'notfound@example.com',
        password: 'pw',
      }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('login should throw UnauthorizedException if password is invalid', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'not-the-same',
      role: 'user',
      fullName: 'Test User',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    await expect(
      service.login({
        email: 'test@example.com',
        password: 'wrong',
      }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('refresh should return new tokens with user data if refresh token valid', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    };
    (userService.findByRefreshToken as jest.Mock).mockResolvedValue(mockUser);
    (userService.update as jest.Mock).mockResolvedValue({});

    const result = await service.refresh('valid-refresh-token');

    expect(result.access_token).toBe('access_token');
    expect(result.refresh_token).toBeDefined();
    expect(result.user).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    });
  });

  it('refresh should throw UnauthorizedException if no token provided', async () => {
    await expect(service.refresh('')).rejects.toThrow(
      'No refresh token provided',
    );
  });

  it('refresh should throw UnauthorizedException if token is invalid', async () => {
    (userService.findByRefreshToken as jest.Mock).mockResolvedValue(null);
    await expect(service.refresh('badtoken')).rejects.toThrow(
      'Invalid refresh token',
    );
  });

  it('logout should revoke refresh token', async () => {
    const mockUser = { id: 1 };
    (userService.findByRefreshToken as jest.Mock).mockResolvedValue(mockUser);
    (userService.update as jest.Mock).mockResolvedValue({});

    const result = await service.logout('valid-refresh-token');

    expect(result.message).toBe('Logged out successfully');
  });

  it('logout should throw UnauthorizedException if no token provided', async () => {
    await expect(service.logout('')).rejects.toThrow(
      'No refresh token provided',
    );
  });

  it('logout should throw UnauthorizedException if token is invalid', async () => {
    (userService.findByRefreshToken as jest.Mock).mockResolvedValue(null);
    await expect(service.logout('badtoken')).rejects.toThrow(
      'Invalid refresh token',
    );
  });

  it('getCurrentUser should return sanitized user data', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'user',
      fullName: 'Test User',
      refreshToken: 'hashed-refresh-token',
    };
    (userService.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.getCurrentUser(1);

    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    });
    expect(result.password).toBeUndefined();
    expect(result.refreshToken).toBeUndefined();
  });

  it('getCurrentUser should throw UnauthorizedException if user not found', async () => {
    (userService.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.getCurrentUser(999)).rejects.toThrow('User not found');
  });
});
