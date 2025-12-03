import { ExtendedConfig } from './schema';
import developmentConfig from './config.development';
import stagingConfig from './config.staging';
import productionConfig from './config.production';
import testConfig from './config.test';
import defaultConfig from './config.default';
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

const env = process.env.NODE_ENV ?? 'development';

const isRecord = (data: unknown) =>
  typeof data === 'object' && !Array.isArray(data);

const deepMergeDefaults = (
  anotherConfig: any,
  _defaultConfig: unknown = defaultConfig,
) => {
  return Object.entries(_defaultConfig as object).reduce(
    (acc, [key, defaultValue]) => {
      const childValue = anotherConfig[key];

      if (isRecord(defaultValue) && isRecord(childValue)) {
        acc[key] = deepMergeDefaults(childValue, defaultValue);
        return acc;
      }

      acc[key] = defaultValue;

      if (childValue !== undefined) {
        acc[key] = childValue;
      }

      return acc;
    },
    anotherConfig,
  );
};

const logger = new Logger('Extended Config');

const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(ExtendedConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const recursiveLog =
    (parent = '') =>
    (error: ValidationError) => {
      if (error.children?.length) {
        error.children.forEach(recursiveLog(`${parent}${error.property}:`));
        return;
      }

      Object.values(error.constraints || {}).forEach((message) => {
        logger.error(`${parent}${error.property}: ${message}`);
      });
    };

  const errorLogger = recursiveLog();

  if (errors.length > 0) {
    for (const error of errors) {
      errorLogger(error);
    }

    process.exit(1);
  }

  return validatedConfig;
};

export default () => {
  let config = developmentConfig;

  switch (env) {
    case 'production':
      config = productionConfig;
      break;
    case 'staging':
      config = stagingConfig;
      break;
    case 'test':
      config = testConfig;
      break;
    default:
      config = developmentConfig;
  }

  const data = deepMergeDefaults(config);

  return validate(data);
};
