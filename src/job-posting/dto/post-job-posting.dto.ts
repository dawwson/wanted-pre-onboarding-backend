import { IsNumber, IsString } from 'class-validator';

export class PostJobPostingDto {
  @IsString()
  jobPosition: string;

  @IsNumber()
  reward: number;

  @IsString()
  description: string;

  @IsString()
  skill: string;
}
