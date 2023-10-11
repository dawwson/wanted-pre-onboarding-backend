import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity.entity';
import { Company } from './company.entity';

export enum Role {
  CORPORATE = 'corporate',
  INDIVIDUAL = 'individual',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company, (company) => company.manager, { lazy: true })
  company: Company;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: Role;
}
