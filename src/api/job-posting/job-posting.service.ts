import { Injectable, NotFoundException } from '@nestjs/common';

import { JobPosting } from '../../entity/job-posting.entity';
import { JobPostingRepository } from '../../repository/job-posting.repository';

import { PostJobPostingDto } from './controller-dto/post-job-posting.dto';
import { PatchJobPostingDto } from './controller-dto/patch-job-posting.dto';
import { UpdateResultDto } from './service-dto/update-result.dto';
import { DeleteResultDto } from './service-dto/delete-result.dto';
import { FindConditionDto } from './service-dto/find-condition.dto';
import { JobApplicationRepository } from '../../repository/job-application.repository';

@Injectable()
export class JobPostingService {
  constructor(
    private readonly jobPostingRepository: JobPostingRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async register(
    companyId: number,
    postJobPostingDto: PostJobPostingDto,
  ): Promise<JobPosting> {
    // JobPosting 객체 생성
    const jobPostingToSave = JobPosting.create(companyId, postJobPostingDto);
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
    const appliedJobApplications =
      await this.jobApplicationRepository.findAppliedByJobPostingId(id);

    // 지원 완료 상태인 지원 내역이 있으면 불합격 처리
    if (appliedJobApplications.length > 0) {
      appliedJobApplications.forEach((ja) => ja.changeToRejected());
      await this.jobApplicationRepository.save(appliedJobApplications);
    }
    // 채용공고 삭제
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

  async getOne(id: number): Promise<JobPosting> {
    const jobPosting = await this.jobPostingRepository.findWithCompanyById(id);

    if (!jobPosting) {
      throw new NotFoundException('채용공고가 존재하지 않습니다.');
    }

    return jobPosting;
  }

  getAllOfCompany(companyId: number): Promise<JobPosting[]> {
    return this.jobPostingRepository.findByCompanyId(companyId);
  }
}
