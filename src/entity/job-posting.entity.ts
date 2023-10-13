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

  @ManyToOne(() => Company, { lazy: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // NOTE: lazy loading 시 prefix, suffix를 붙여서 주는데,
  // controller 단위 테스트할 때 타입이 필요해서 추가함(DB 테이블에는 생기지 않음)
  // TODO: company로 반환할 수 있는 방법 찾아보기
  __company__: Company;

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
  static create(company: Company, postJobPostingDto: PostJobPostingDto) {
    const jobPosting = new JobPosting();
    jobPosting.company = company;
    jobPosting.jobPosition = postJobPostingDto.jobPosition;
    jobPosting.description = postJobPostingDto.description;
    jobPosting.reward = postJobPostingDto.reward;
    jobPosting.skill = postJobPostingDto.skill;
    return jobPosting;
  }
}
