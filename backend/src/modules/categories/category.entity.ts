import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Navigation } from '../navigation/navigation.entity.js';
import { Product } from '../products/product.entity.js';

@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'text', unique: true, nullable: true })
  link?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne('Navigation', (navigation: Navigation) => navigation.categories, {
    nullable: true,
  })
  navigation?: Navigation;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
