import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../user/user.schema";
import { DattedObjectSchema } from "../utility/datted_object.utility";

@Schema({versionKey: false})
export class Organization extends DattedObjectSchema {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    members: User[];

    @Prop({type: {type: mongoose.Schema.Types.ObjectId}, ref: 'User'})
    owner: User;

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);