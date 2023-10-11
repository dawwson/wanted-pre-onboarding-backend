import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { JobPostingRepository } from '../repository/job-posting.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, JobPostingRepository],
  exports: [UserService],
})
export class UserModule {}
