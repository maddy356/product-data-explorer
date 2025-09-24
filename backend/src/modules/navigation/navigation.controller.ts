import { Body, Controller, Get, Post } from '@nestjs/common';
import { NavigationService } from './navigation.service.js';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navService: NavigationService) {}

  @Get()
  findAll() {
    return this.navService.findAll();
  }

  @Post()
  create(@Body() body: { title: string; link?: string }) {
    return this.navService.create(body.title, body.link);
  }
}
