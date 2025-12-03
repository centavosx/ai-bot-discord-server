import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsIn, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsString()
  @IsIn(['production', 'staging', 'development', 'test'])
  NODE_ENV: 'production' | 'staging' | 'development' | 'test' = 'development';

  @IsString()
  CLOUDFLARE_ACCESS_CLIENT_ID: string;

  @IsString()
  CLOUDFLARE_ACCESS_CLIENT_SECRET: string;

  @IsString()
  DISCORD_BOT_TOKEN: string;
}

const logger = new Logger('Environment Variables');

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    for (const error of errors) {
      Object.values(error.constraints || {}).forEach((message) => {
        logger.error(`${error.property}: ${message}`);
      });
    }

    process.exit(1);
  }

  return validatedConfig;
}
