import { IsNumber } from 'class-validator';

export class PostJobApplicationDto {
  @IsNumber()
  jobPostingId: number;
}
