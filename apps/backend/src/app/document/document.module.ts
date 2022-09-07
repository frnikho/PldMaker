import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentHelper } from "./document.helper";

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, DocumentHelper]
})
export class DocumentModule {}
