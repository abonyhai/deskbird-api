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
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiProjectRoute({
    path: '/:id',
    method: 'GET',
    ok: { description: 'Get user by id' },
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiProjectRoute({
    path: '/',
    method: 'POST',
    ok: { description: 'Create user' },
  })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiProjectRoute({
    path: '/:id',
    method: 'PATCH',
    ok: { description: 'Update user' },
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @ApiProjectRoute({
    path: '/:id',
    method: 'DELETE',
    ok: { description: 'Delete user' },
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
