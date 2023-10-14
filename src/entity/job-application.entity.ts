import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
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
// NOTE: applicant_id, job_posting_id 묶어서 UNIQUE로 관리
@Unique(['applicantId', 'jobPostingId'])
export class JobApplication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobPosting, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'job_posting_id' })
  jobPosting: JobPosting;

  @Column({ name: 'job_posting_id', nullable: true })
  jobPostingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column({ name: 'applicant_id' })
  applicantId: number;

  @Column({ default: JobApplicationStatus.APPLIED })
  status: JobApplicationStatus;

  changeToRejected() {
    this.status = JobApplicationStatus.REJECTED;
  }
}
