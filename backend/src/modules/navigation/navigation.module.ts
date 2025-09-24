import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationController } from './navigation.controller.js';
import { Navigation } from './navigation.entity.js';
import { NavigationService } from './navigation.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Navigation])],
  providers: [NavigationService],
  controllers: [NavigationController],
})
export class NavigationModule {}
