import { Module } from '@nestjs/common';
import { PldService } from './pld.service';
import { PldController } from './pld.controller';

@Module({
  providers: [PldService],
  controllers: [PldController]
})
export class PldModule {}
