import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PostJobPostingDto {
  @IsString()
  @IsNotEmpty()
  jobPosition: string;

  @IsNumber()
  @Min(0)
  reward: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  skill: string;
}
