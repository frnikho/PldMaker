import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value.match(/^[0-9a-fA-F]{24}$/))
      throw new BadRequestException('Invalid ObjectId format !');
    return value;
  }

}
