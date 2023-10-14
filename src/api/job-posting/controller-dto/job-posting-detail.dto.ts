import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { JobPosting } from '../../../entity/job-posting.entity';
import { Company } from '../../../entity/company.entity';

@Exclude()
export class JobPostingDetailDto {
  @Expose()
  id: number;

  @Expose({ name: 'company' })
  @Transform(({ value }) => {
    // 생성일, 수정일 제외하도록 값 변환
    const { createdAt, updatedAt, ...rest } = value;
    return rest;
  })
  company: Partial<Company>;

  @Expose()
  jobPosition: string;

  @Expose()
  description: string;

  @Expose()
  reward: number;

  @Expose()
  skill: string;

  static of(jobPosting: JobPosting): JobPostingDetailDto {
    return plainToInstance(JobPostingDetailDto, jobPosting);
  }
}
