import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private sanitizeUser(user: User): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...sanitizedUser } = user;
    return sanitizedUser as UserDto;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    return user ? this.sanitizeUser(user) : null;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    const user = this.userRepository.create(dto);
    const saved = await this.userRepository.save(user);
    return this.sanitizeUser(saved);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserDto | null> {
    await this.userRepository.update(id, dto);
    const updated = await this.userRepository.findOneBy({ id });
    return updated ? this.sanitizeUser(updated) : null;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  async findByRefreshToken(refreshToken: string) {
    const users = await this.userRepository.find();
    for (const user of users) {
      if (
        user.refreshToken &&
        (await bcrypt.compare(refreshToken, user.refreshToken))
      ) {
        return user;
      }
    }
    return null;
  }
}
