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
    return { id: newJobPosting.id }; // TODO: Response 타입 지정
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
      data: { id },
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
  async findAllJobPostings(@Query('search') search?: string) {
    const jobPostings = await this.jobPostingService.findAll({ search });
    console.log(JobPostingListDto.of(jobPostings)[0]);
    return {
      message: '모든 채용공고가 성공적으로 조회되었습니다.',
      jobPostings: JobPostingListDto.of(jobPostings),
    };
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostingService.findOne(+id);
  }
 */
}
