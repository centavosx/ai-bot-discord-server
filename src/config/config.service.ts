import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config.schema';
import { NestedStringKey, NestedStringValue } from '../@shared/type/nested';
import { ClassToRecord } from '../@shared/type/class-to-record';
import { ExtendedConfig } from './extended/schema';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get<
    K extends NestedStringKey<
      ClassToRecord<EnvironmentVariables & ExtendedConfig>
    >,
  >(key: K) {
    return this.configService.get(key) as NestedStringValue<
      ClassToRecord<EnvironmentVariables & ExtendedConfig>,
      K
    >;
  }
}
