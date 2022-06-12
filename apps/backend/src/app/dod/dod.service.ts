import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Dod} from "./dod.schema";
import {Model} from "mongoose";
import {DodCreateBody} from "../../../../../libs/data-access/pld/dod/DodBody";
import {DodStatus} from "../../../../../libs/data-access/pld/dod/Dod";

@Injectable()
export class DodService {

  constructor(@InjectModel(Dod.name) private dodModel: Model<Dod>) {}

  public async createFromBody(dodBody: DodCreateBody) {
    return this.dodModel.create({
      ...dodBody,
      estimatedWorkTime: dodBody.estimatedWorkTime.map((wt) => (wt))
    })
  }

  public async create(dod: Dod) {
    return this.dodModel.create(dod);
  }

  public async find(id: string) {
    return this.dodModel.findOne({_id: id})
      .populate('pldOwner')
      .populate('owner')
      .exec();
  }

  public async findByPldId(pldId: string) {
    return this.dodModel.find({pldOwner: pldId})
      .populate('pldOwner')
      .populate('owner')
      .exec();
  }

  public async delete(id: string) {
    return this.dodModel.findOneAndDelete({_id: id}).exec();
  }

  public async updateStatus(id: string, status: DodStatus) {
    return this.dodModel.findOneAndUpdate({_id: id}, {status: status}, {new: true, populate: ['pldOwner', 'owner']})
      .exec();
  }

  public async addRevision() {
    //TODO do addRevision function
  }

}
