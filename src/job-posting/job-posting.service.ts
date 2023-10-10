import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostJobPostingDto } from './dto/post-job-posting.dto';
import { JobPosting } from '../entity/job-posting.entity';
import { Company } from '../entity/company.entity';

@Injectable()
export class JobPostingService {
  constructor(
    @InjectRepository(JobPosting)
    private readonly jobPostingRepository: Repository<JobPosting>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // TODO: postJobPostingDto에서 서비스용 다른 dto로 변환해야할지 고민됨...
  async register(
    userId: number,
    postJobPostingDto: PostJobPostingDto,
  ): Promise<JobPosting> {
    const company = await this.companyRepository.findOneBy({
      manager: { id: userId },
    });

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
