import { IsNotEmpty, IsUrl } from 'class-validator';

export class ExtendedConfig {
  @IsUrl()
  @IsNotEmpty()
  webhook: string;
}
