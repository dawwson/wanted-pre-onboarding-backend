import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

// NOTE: 동적으로 필요한 레파지토리를 설정해주는 모듈.
// 커스텀 Repository를 필요로 하는 모듈에서 DynamicRepositoryModule.forRepository([]) 형식으로 가져올 수 있다.
@Module({})
export class DynamicRepositoryModule {
  static forRepository(repositories: EntityClassOrSchema[]): DynamicModule {
    return {
      module: DynamicRepositoryModule,
      imports: [TypeOrmModule.forFeature(repositories)],
      providers: repositories as Provider[],
      exports: repositories as Provider[],
    };
  }
}
