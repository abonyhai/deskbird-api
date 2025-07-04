import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

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

  it('findAll should call repository.find', async () => {
    const findSpy = jest.spyOn(repo, 'find').mockResolvedValue([]);
    await service.findAll();
    expect(findSpy).toHaveBeenCalled();
  });

  it('findOne should call repository.findOneBy', async () => {
    const findOneBySpy = jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    await service.findOne(1);
    expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findByEmail should call repository.findOneBy', async () => {
    const findOneBySpy = jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    await service.findByEmail('test@example.com');
    expect(findOneBySpy).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('create should call repository.create and save', async () => {
    const createSpy = jest.spyOn(repo, 'create').mockReturnValue({} as User);
    const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue({} as User);
    await service.create({} as any);
    expect(createSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('update should call repository.update', async () => {
    const updateSpy = jest.spyOn(repo, 'update').mockResolvedValue({} as any);
    await service.update(1, {} as any);
    expect(updateSpy).toHaveBeenCalledWith(1, {});
  });

  it('remove should call repository.delete', async () => {
    const deleteSpy = jest.spyOn(repo, 'delete').mockResolvedValue({} as any);
    await service.remove(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
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
});
