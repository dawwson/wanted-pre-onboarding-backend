import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../../entity/user.entity';
import { JobPostingRepository } from '../../repository/job-posting.repository';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  getOne(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  // TODO: Guard로 리팩터
  async checkCanUpdateJobPosting(user, jobPostingId) {
    const jobPosting =
      await this.jobPostingRepository.findWithCompanyById(jobPostingId);

    if (!jobPosting) {
      throw new NotFoundException('채용공고가 존재하지 않습니다.');
    }

    // NOTE: lazy loading으로 인해 user.company 호출시 promise로 반환됨
    if ((await user.company).id !== jobPosting.company.id) {
      throw new ForbiddenException('접근할 수 없는 채용공고 입니다.');
    }
  }

  async checkCanDeleteJobPosting(user, jobPostingId) {
    const jobPosting =
      await this.jobPostingRepository.findWithCompanyById(jobPostingId);

    if (!jobPosting) {
      throw new NotFoundException('채용공고가 존재하지 않습니다.');
    }

    // NOTE: lazy loading으로 인해 user.company 호출시 promise로 반환됨
    if ((await user.company).id !== jobPosting.company.id) {
      throw new ForbiddenException('접근할 수 없는 채용공고 입니다.');
    }
  }
}
