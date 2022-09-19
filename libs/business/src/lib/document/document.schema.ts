import { ModelDefinition, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({versionKey: false})
export class Document {

}

export const DocumentSchema = SchemaFactory.createForClass(Document);

export const DocumentDefinition: ModelDefinition = {
  name: Document.name,
  schema: DocumentSchema
}
