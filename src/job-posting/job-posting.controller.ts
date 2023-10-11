import { Controller, Post, Body, Req, Patch, Param } from '@nestjs/common';

import { Roles } from '../common/guard/roles.decorator';
import { RequestWithUser } from '../common/interface/request.interface';
import { Role } from '../entity/user.entity';

import { UserService } from '../user/user.service';
import { JobPostingService } from './job-posting.service';

import { PostJobPostingDto } from './dto/post-job-posting.dto';
import { PatchJobPostingDto } from './dto/patch-job-posting.dto';

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
    return this.jobPostingService.update(+id, patchJobPostingDto);
  }

  /*
  @Get()
  findAll() {
    return this.jobPostingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostingService.remove(+id);
  }
 */
}
