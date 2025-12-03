import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';

@Module({
  imports: [ConfigModule, EventModule],
})
export class AppModule {}
