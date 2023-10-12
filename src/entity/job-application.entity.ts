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

export enum JobApplicationStatus {
  APPLIED = 'applied',
  REJECTED = 'rejected',
  PASSED = 'passed',
}

@Entity('job_application')
export class JobApplication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobPosting)
  @JoinColumn({ name: 'job_posting_id' })
  jobPosting: JobPosting;

  @Column({ name: 'job_posting_id' })
  jobPostingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column({ name: 'applicant_id' })
  applicantId: number;

  @Column({ default: JobApplicationStatus.APPLIED })
  status: JobApplicationStatus;
}
