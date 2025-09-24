import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Categories } from '../categories/category.entity.js';

@Entity('navigation')
export class Navigation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @Column({ nullable: true })
  link!: string;

  @OneToMany(() => Categories, (cat) => cat.navigation)
  categories!: Categories[];
}
