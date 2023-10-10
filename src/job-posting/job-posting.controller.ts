import { Controller, Post, Body, Req } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { PostJobPostingDto } from './dto/post-job-posting.dto';
import { Roles } from '../common/guard/roles.decorator';
import { RequestWithUser } from '../common/interface/request.interface';
import { Role } from '../entity/user.entity';

@Controller('job-postings')
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Post()
  @Roles([Role.CORPORATE]) //
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
  /*
  @Get()
  findAll() {
    return this.jobPostingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostingDto: UpdateJobPostingDto) {
    return this.jobPostingService.update(+id, updateJobPostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostingService.remove(+id);
  }
 */
}
