import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity.entity';

export enum Role {
  CORPORATE = 'corporate',
  INDIVIDUAL = 'individual',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // NOTE: 생략 가능함. 필요해지면 추가(양방향)
  // @OneToOne(() => Company, (company) => company.manager)
  // company: Company;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: Role;
}
