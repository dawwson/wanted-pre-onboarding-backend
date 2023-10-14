import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { JobPosting } from '../../../entity/job-posting.entity';

@Exclude()
export class JobPostingListDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.company.name)
  companyName: string;

  @Expose()
  @Transform(({ obj }) => obj.company.country)
  companyCountry: string;

  @Expose()
  @Transform(({ obj }) => obj.company.region)
  companyRegion: string;

  @Expose()
  jobPosition: string;

  @Expose()
  reward: number;

  @Expose()
  skill: string;

  static of(jobPostings: JobPosting[]): JobPostingListDto[] {
    return plainToInstance(JobPostingListDto, jobPostings);
  }
}
