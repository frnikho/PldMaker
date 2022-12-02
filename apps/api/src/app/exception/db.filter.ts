import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class DbExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception.errorLabels);
    console.log(exception.name);
    console.log(exception.message);
    console.log(exception.errmsg);
    return manageException(exception, response);
  }
}


const manageException = (exception: MongoError, res: Response) => {
  if (exception.code === 11000) {
    return res.status(400).json({message: 'Un objet existe déjà avec cette valeur !', value: ''});
  }
  return res.json();
}
