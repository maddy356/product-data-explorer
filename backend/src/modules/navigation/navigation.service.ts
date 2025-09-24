import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './navigation.entity.js';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private navRepo: Repository<Navigation>,
  ) {}

  findAll() {
    return this.navRepo.find({ relations: ['categories'] });
  }

  create(title: string, link?: string) {
    const nav = this.navRepo.create({ title, link });
    return this.navRepo.save(nav);
  }
}
