import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { JobPosting } from '../../../entity/job-posting.entity';

@Exclude()
export class JobPostingListDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.__company__.name) // NOTE: 엔티티의 프로퍼티를 응답 DTO에 매핑
  companyName: string;

  @Expose()
  @Transform(({ obj }) => obj.__company__.country) // NOTE: 엔티티의 프로퍼티를 응답 DTO에 매핑
  companyCountry: string;

  @Expose()
  @Transform(({ obj }) => obj.__company__.region) // NOTE: 엔티티의 프로퍼티를 응답 DTO에 매핑
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
