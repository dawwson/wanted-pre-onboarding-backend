import { PartialType } from '@nestjs/mapped-types';
import { PostJobPostingDto } from './post-job-posting.dto';

export class PatchJobPostingDto extends PartialType(PostJobPostingDto) {}
