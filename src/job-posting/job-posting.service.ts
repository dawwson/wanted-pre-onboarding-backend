import { Injectable } from '@nestjs/common';

import { JobPosting } from '../entity/job-posting.entity';
import { JobPostingRepository } from '../repository/job-posting.repository';
import { CompanyRepository } from '../repository/company.repository';

import { PostJobPostingDto } from './dto/post-job-posting.dto';

@Injectable()
export class JobPostingService {
  constructor(
    private readonly jobPostingRepository: JobPostingRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  // TODO: postJobPostingDto에서 서비스용 다른 dto로 변환해야할지 고민됨...
  async register(userId: number, postJobPostingDto: PostJobPostingDto) {
    const company = await this.companyRepository.findByManagerId(userId);

    // TODO: 채용포지션 중복검사?
    // TODO: 엔티티 안으로 비즈니스 로직 넣어서 리팩터
    const jobPostingToSave = new JobPosting();
    jobPostingToSave.company = company;
    jobPostingToSave.jobPosition = postJobPostingDto.jobPosition;
    jobPostingToSave.description = postJobPostingDto.description;
    jobPostingToSave.reward = postJobPostingDto.reward;
    jobPostingToSave.skill = postJobPostingDto.skill;

    return this.jobPostingRepository.save(jobPostingToSave);
  }
  /*
  findAll() {
    return `This action returns all jobPosting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobPosting`;
  }

  update(id: number, updateJobPostingDto: UpdateJobPostingDto) {
    return `This action updates a #${id} jobPosting`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobPosting`;
  }
 */
}