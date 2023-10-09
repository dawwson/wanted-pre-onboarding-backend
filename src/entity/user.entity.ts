import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';
import { BaseEntity } from './base-entity.entity';

export type Role = 'corporate' | 'individual';

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
