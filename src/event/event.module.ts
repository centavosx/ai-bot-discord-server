import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { HttpModule } from '../http/http.module';

@Module({
  imports: [HttpModule],
  providers: [EventService],
})
export class EventModule {}
