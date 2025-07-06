import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiProjectController } from 'src/shared/decorators/controller';
import { ApiProjectRoute } from 'src/shared/decorators/method';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiProjectController('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiProjectRoute({
    path: '/',
    method: 'GET',
    ok: { description: 'List all users' },
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserDto],
  })
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @ApiProjectRoute({
    path: '/:id',
    method: 'GET',
    ok: { description: 'Get user by id' },
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserDto | null> {
    return this.userService.findOne(id);
  }

  @ApiProjectRoute({
    path: '/',
    method: 'POST',
    ok: { description: 'Create user' },
  })
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(dto);
  }

  @ApiProjectRoute({
    path: '/:id',
    method: 'PATCH',
    ok: { description: 'Update user' },
  })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto | null> {
    return this.userService.update(id, dto);
  }

  @ApiProjectRoute({
    path: '/:id',
    method: 'DELETE',
    ok: { description: 'Delete user' },
  })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.userService.remove(id);
  }
}
