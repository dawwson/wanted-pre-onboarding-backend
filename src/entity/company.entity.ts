import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity.entity';
import { User } from './user.entity';

@Entity('company')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'manager_id' }) // NOTE: 외래키를 가진 쪽에만 작성
  manager: User;

  // NOTE: 생략 가능함. 필요해지면 추가(양방향)
  // @OneToMany(() => JobPosting, (jobPosting) => jobPosting.company)
  // jobPostings: JobPosting[];

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  region: string;
}
