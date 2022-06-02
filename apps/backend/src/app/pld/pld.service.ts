import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Pld, PldDocument} from "./pld.schema";
import {Model} from "mongoose";

@Injectable()
export class PldService {

  constructor(@InjectModel(Pld.name) private pldModel: Model<Pld>) {}

  public async create(pld: Pld): Promise<PldDocument> {
    return this.pldModel.create(pld);
  }

  public async find(pldId: string): Promise<PldDocument | null> {
    return this.pldModel.findOne({_id: pldId})
      .populate('owner')
      .exec();
  }

  public async update(pldId: string, ownerId: string, pld: PldDocument): Promise<PldDocument | null> {
    return this.pldModel.findOneAndUpdate({_id: pldId, owner: ownerId}, pld, {new: true, populate: 'owner'})
      .exec();
  }

  public async delete(pldId: string, ownerId: string): Promise<PldDocument | null> {
    return this.pldModel.findOneAndDelete({_id: pldId, owner: ownerId}, {populate: 'owner'})
      .exec();
  }

}
