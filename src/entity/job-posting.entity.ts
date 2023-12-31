import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity.entity';
import { Company } from './company.entity';
import { PostJobPostingDto } from '../api/job-posting/controller-dto/post-job-posting.dto';

@Entity('job_posting')
export class JobPosting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ name: 'job_position' })
  jobPosition: string;

  @Column()
  reward: number;

  @Column()
  description: string;

  @Column()
  skill: string;

  /**
   * JobPosting 생성 메서드
   * @param company
   * @param postJobPostingDto
   */
  static create(companyId: number, postJobPostingDto: PostJobPostingDto) {
    const jobPosting = new JobPosting();
    jobPosting.companyId = companyId;
    jobPosting.jobPosition = postJobPostingDto.jobPosition;
    jobPosting.description = postJobPostingDto.description;
    jobPosting.reward = postJobPostingDto.reward;
    jobPosting.skill = postJobPostingDto.skill;
    return jobPosting;
  }
}
