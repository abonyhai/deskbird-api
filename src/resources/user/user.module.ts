import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtStrategy, JwtAuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
