import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {MongooseError} from "mongoose";

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    console.log('ABC', exception.message);
  }
}
