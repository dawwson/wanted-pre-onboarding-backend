import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity.entity';
import { Company } from './company.entity';

@Entity('job_posting')
export class JobPosting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'job_position' })
  jobPosition: string;

  @Column()
  reward: number;

  @Column()
  description: string;

  @Column()
  skill: string;
}
