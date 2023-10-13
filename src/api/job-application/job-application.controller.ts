import { Controller, Post, Body, Req } from '@nestjs/common';

import { Roles } from '../../common/guard/roles.decorator';
import { RequestWithUser } from '../../common/interface/request.interface';
import { Role } from '../../entity/user.entity';

import { PostJobApplicationDto } from './controller-dto/post-job-application.dto';
import { JobApplicationService } from './job-application.service';

@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  @Roles([Role.INDIVIDUAL])
  async registerJobApplication(
    @Req() req: RequestWithUser,
    @Body() { jobPostingId }: PostJobApplicationDto,
  ) {
    const newJobApplication = await this.jobApplicationService.register(
      req.user.id,
      jobPostingId,
    );

    return {
      message: '지원내역이 성공적으로 등록되었습니다.',
      jobApplication: {
        id: newJobApplication.id,
      },
    };
  }
}
