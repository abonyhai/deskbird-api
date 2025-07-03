import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule, TypeOrmConfig } from './shared/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forRootAsync(TypeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
