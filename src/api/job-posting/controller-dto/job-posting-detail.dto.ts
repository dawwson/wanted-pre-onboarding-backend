import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { JobPosting } from '../../../entity/job-posting.entity';
import { Company } from '../../../entity/company.entity';

@Exclude()
export class JobPostingDetailDto {
  @Expose()
  id: number;

  // __company__ => company로 변환
  @Expose({ name: '__company__' })
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
