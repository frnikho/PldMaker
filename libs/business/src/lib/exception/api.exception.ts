import { HttpException } from "@nestjs/common";
import { ApiError } from "@pld/shared";

export class ApiException extends HttpException {

  constructor(error: ApiError) {
    super(JSON.stringify(error), error.status);
  }

}
