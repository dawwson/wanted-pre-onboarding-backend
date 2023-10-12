import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { JobPosting } from '../../entity/job-posting.entity';
import { Company } from '../../entity/company.entity';

@Exclude()
export class JobPostingListDto {
  @Expose()
  id: number;

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

  static of(jobPostings: JobPosting[]): JobPostingListDto[] {
    return plainToInstance(JobPostingListDto, jobPostings);
  }
}
