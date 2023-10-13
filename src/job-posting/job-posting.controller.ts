import {
  Controller,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';

import { Roles } from '../common/guard/roles.decorator';
import { RequestWithUser } from '../common/interface/request.interface';
import { Role } from '../entity/user.entity';

import { UserService } from '../user/user.service';
import { JobPostingService } from './job-posting.service';

import { PostJobPostingDto } from './controller-dto/post-job-posting.dto';
import { PatchJobPostingDto } from './controller-dto/patch-job-posting.dto';
import { JobPostingListDto } from './controller-dto/job-posting-list.dto';
import { JobPostingDetailDto } from './controller-dto/job-posting-detail.dto';

@Controller('job-postings')
export class JobPostingController {
  constructor(
    private readonly jobPostingService: JobPostingService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @Roles([Role.CORPORATE])
  async registerJobPosting(
    @Req() req: RequestWithUser,
    @Body() postJobPostingDto: PostJobPostingDto,
  ) {
    const newJobPosting = await this.jobPostingService.register(
      req.user.id,
      postJobPostingDto,
    );
    return {
      message: '채용공고가 성공적으로 등록되었습니다.',
      jobPosting: { id: newJobPosting.id },
    };
  }

  @Patch(':id')
  @Roles([Role.CORPORATE])
  async updateJobPosting(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() patchJobPostingDto: PatchJobPostingDto,
  ) {
    await this.userService.checkCanUpdateJobPosting(req.user, +id);
    await this.jobPostingService.update(+id, patchJobPostingDto);

    return {
      message: '채용공고가 성공적으로 업데이트 되었습니다.',
      jobPosting: { id },
    };
  }

  @Delete(':id')
  @Roles([Role.CORPORATE])
  @HttpCode(204)
  async removeJobPosting(@Req() req: RequestWithUser, @Param('id') id: string) {
    await this.userService.checkCanDeleteJobPosting(req.user, +id);
    await this.jobPostingService.remove(+id);
  }

  @Get()
  async getAllJobPostings(@Query('search') search?: string) {
    const jobPostings = await this.jobPostingService.getAll({ search });

    return {
      message: '모든 채용공고가 성공적으로 조회되었습니다.',
      jobPostings: JobPostingListDto.of(jobPostings),
    };
  }

  @Get(':id')
  async getDetailJobPosting(@Param('id') id: string) {
    // 1. 현재 채용공고 상세 조회
    const jobPosting = await this.jobPostingService.getOne(+id);
    // 2. 현재 채용공고의 회사에서 올린 다른 채용공고 조회
    const jobPostingsOfCompany = await this.jobPostingService.getAllOfCompany(
      jobPosting['__company__'].id, // NOTE: lazy 로딩으로 인해 __company__로 변환됨
    );

    return {
      message: '채용공고가 성공적으로 조회되었습니다.',
      jobPosting: JobPostingDetailDto.of(jobPosting),
      otherJobPostings: jobPostingsOfCompany.reduce((acc, jp) => {
        // 현재 채용공고 id를 제외하고 id 배열 생성
        if (jp.id !== +id) {
          acc.push(jp.id);
        }
        return acc;
      }, [] as number[]),
    };
  }
}
