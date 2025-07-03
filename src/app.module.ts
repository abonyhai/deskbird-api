import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigModule, TypeOrmConfig } from './shared/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/utils/auth.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
