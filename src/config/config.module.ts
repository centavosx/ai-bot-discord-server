import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './config.schema';
import { ConfigService } from './config.service';
import extended from './extended';

const paths = {
  test: ['.env.test'],
  development: ['.env', '.env.local', '.env.development'],
  staging: ['.env.staging'],
  production: ['.env.production'],
};

const env = (process.env.NODE_ENV as keyof typeof paths) ?? 'development';

const envPath = (paths[env] || paths.development) as unknown as string[];

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
      envFilePath: envPath,
      isGlobal: true,
      load: [extended],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
