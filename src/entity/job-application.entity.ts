import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity.entity';
import { JobPosting } from './job-posting.entity';
import { User } from './user.entity';

export type JobApplicationStatus = 'applied' | 'rejected' | 'passed';

@Entity('job_application')
export class JobApplication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobPosting)
  @JoinColumn({ name: 'job_posting_id' })
  jobPosting: JobPosting;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column()
  status: JobApplicationStatus;
}
