import { Injectable } from '@nestjs/common';

import { JobPosting } from '../../entity/job-posting.entity';
import { JobPostingRepository } from '../../repository/job-posting.repository';
import { CompanyRepository } from '../../repository/company.repository';

import { PostJobPostingDto } from './controller-dto/post-job-posting.dto';
import { PatchJobPostingDto } from './controller-dto/patch-job-posting.dto';
import { UpdateResultDto } from './service-dto/update-result.dto';
import { DeleteResultDto } from './service-dto/delete-result.dto';
import { FindConditionDto } from './service-dto/find-condition.dto';

@Injectable()
export class JobPostingService {
  constructor(
    private readonly jobPostingRepository: JobPostingRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async register(
    userId: number,
    postJobPostingDto: PostJobPostingDto,
  ): Promise<JobPosting> {
    // 채용공고를 올릴 회사 조회
    const company = await this.companyRepository.findByManagerId(userId);
    // JobPosting 객체 생성
    const jobPostingToSave = JobPosting.create(company, postJobPostingDto);
    // DB에 저장
    return this.jobPostingRepository.save(jobPostingToSave);
  }

  async update(
    id: number,
    patchJobPostingDto: PatchJobPostingDto,
  ): Promise<UpdateResultDto> {
    const updateResult = await this.jobPostingRepository.update(
      id,
      patchJobPostingDto,
    );

    return new UpdateResultDto(updateResult.affected);
  }

  async remove(id: number): Promise<DeleteResultDto> {
    // TODO: APPLIED인 지원내역이 있는지 검사
    const deleteResult = await this.jobPostingRepository.delete(id);
    return new DeleteResultDto(deleteResult.affected);
  }

  getAll(findConditionDto: FindConditionDto): Promise<JobPosting[]> {
    const { search } = findConditionDto;

    if (!search) {
      return this.jobPostingRepository.findWithCompany();
    }
    // 회사 이름, 사용기술로 검색
    return this.jobPostingRepository.findWithCompanyBySearch(search);
  }

  getOne(id: number): Promise<JobPosting> {
    return this.jobPostingRepository.findWithCompanyById(id);
  }

  getAllOfCompany(companyId: number): Promise<JobPosting[]> {
    return this.jobPostingRepository.findByCompanyId(companyId);
  }
}
