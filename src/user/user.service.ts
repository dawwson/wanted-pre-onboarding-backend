import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { JobPostingRepository } from '../repository/job-posting.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // TODO: 커스텀 레파지토리로 분리
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  getUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async checkCanUpdateJobPosting(user, jobPostingId) {
    const jobPosting = await this.jobPostingRepository.findOneBy(jobPostingId);

    if (!jobPosting) {
      throw new NotFoundException('채용공고가 존재하지 않습니다.');
    }

    // NOTE: lazy loading으로 인해 company 호출시 promise로 반환됨
    if ((await user.company).id !== (await jobPosting.company).id) {
      throw new ForbiddenException('접근할 수 없는 채용공고 입니다.');
    }

    return;
  }
}
