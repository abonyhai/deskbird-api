import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return sanitized users', async () => {
    const mockUsers = [
      {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        fullName: 'Test User',
        role: 'user',
        refreshToken: 'hashed-refresh-token',
      } as User,
    ];
    jest.spyOn(repo, 'find').mockResolvedValue(mockUsers);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'user',
      } as UserDto,
    ]);
    expect((result[0] as any).password).toBeUndefined();
    expect((result[0] as any).refreshToken).toBeUndefined();
  });

  it('findOne should return sanitized user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
      fullName: 'Test User',
      role: 'user',
      refreshToken: 'hashed-refresh-token',
    } as User;
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(mockUser);

    const result = await service.findOne(1);

    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'user',
    } as UserDto);
    expect((result as any)?.password).toBeUndefined();
    expect((result as any)?.refreshToken).toBeUndefined();
  });

  it('findOne should return null if user not found', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

    const result = await service.findOne(1);

    expect(result).toBeNull();
  });

  it('findByEmail should call repository.findOneBy', async () => {
    const findOneBySpy = jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    await service.findByEmail('test@example.com');
    expect(findOneBySpy).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('create should return sanitized user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
      fullName: 'Test User',
      role: 'user',
      refreshToken: 'hashed-refresh-token',
    } as User;
    jest.spyOn(repo, 'create').mockReturnValue(mockUser);
    jest.spyOn(repo, 'save').mockResolvedValue(mockUser);

    const result = await service.create({} as any);

    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'user',
    } as UserDto);
    expect((result as any).password).toBeUndefined();
    expect((result as any).refreshToken).toBeUndefined();
  });

  it('update should return the updated sanitized user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
      fullName: 'Test User',
      role: 'user',
      refreshToken: 'hashed-refresh-token',
    } as User;
    const updateSpy = jest.spyOn(repo, 'update').mockResolvedValue({} as any);
    const findOneBySpy = jest.spyOn(repo, 'findOneBy').mockResolvedValue(mockUser);

    const result = await service.update(1, { fullName: 'Test User' });

    expect(updateSpy).toHaveBeenCalledWith(1, { fullName: 'Test User' });
    expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'user',
    } as UserDto);
    expect((result as any).password).toBeUndefined();
    expect((result as any).refreshToken).toBeUndefined();
  });

  it('remove should return { deleted: true }', async () => {
    const deleteSpy = jest.spyOn(repo, 'delete').mockResolvedValue({} as any);
    const result = await service.remove(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });

  it('findByRefreshToken should return user if token matches', async () => {
    const user = { id: 1, refreshToken: 'hashed' } as User;
    jest.spyOn(repo, 'find').mockResolvedValue([user]);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const result = await service.findByRefreshToken('token');
    expect(result).toBe(user);
  });

  it('findByRefreshToken should return null if no match', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([]);
    const result = await service.findByRefreshToken('token');
    expect(result).toBeNull();
  });

  it('mockHashAllPasswords should hash all user passwords and return count', async () => {
    const users = [
      { id: 1, password: 'plain1' } as User,
      { id: 2, password: 'plain2' } as User,
    ];
    jest.spyOn(repo, 'find').mockResolvedValue(users);
    const saveSpy = jest
      .spyOn(repo, 'save')
      .mockImplementation(async (user) => user as any);
    const hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async (pw) => `hashed-${pw}`);

    const result = await service.mockHashAllPasswords('testpass');

    expect(hashSpy).toHaveBeenCalledWith('testpass', 10);
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(users[0].password).toBe('hashed-testpass');
    expect(users[1].password).toBe('hashed-testpass');
    expect(result).toEqual({ updated: 2 });
  });
});
