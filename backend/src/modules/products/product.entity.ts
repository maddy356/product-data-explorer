import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Categories } from '../categories/category.entity.js';

@Entity('products')   // ✅ match table name
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  source_id!: string;

  @Column()
  title!: string;

  @Column('decimal')
  price!: number;

  @Column()
  currency!: string;

  @Column()
  image_url!: string;

  @Column()
  source_url!: string;

  @Column({ type: 'timestamp', nullable: true })
  last_scraped_at?: Date;

  // ✅ Foreign key column
  @Column()
  categoryId!: number;

  @ManyToOne('Categories', (category: Categories) => category.products)
  category!: Categories;
}
