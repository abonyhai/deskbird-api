import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule, TypeOrmConfig } from './shared/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './resources/user/utils/user.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
