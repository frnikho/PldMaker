import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectIdPipe } from "../../pipe/objectId.pipe";
import { Mfa } from "../mfa/mfa.schema";
import { MfaHelper } from "../mfa/mfa.helper";

@Injectable()
export class MfaPipe implements PipeTransform {

  constructor(@InjectModel('Mfa') private mfaModel: Model<Mfa>) {
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    value = new ObjectIdPipe().transform(value, metadata);
    const mfa = await MfaHelper.populateAndExecute(this.mfaModel.findOne({_id: value}).select('+secret'));
    if (mfa === null || mfa === undefined)
      throw new BadRequestException('Invalid Mfa ID');
    return mfa;
  }
}
