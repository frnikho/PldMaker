import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ApiException } from "../exception/api.exception";
import { ApiErrorsCodes, buildException } from "@pld/shared";

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || !value.match(/^[0-9a-fA-F]{24}$/))
      throw new ApiException(buildException(ApiErrorsCodes.INVALID_OBJECT_ID, 'Invalid ObjectId format !'));
    return value;
  }
}
