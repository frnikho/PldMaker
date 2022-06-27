import {Injectable} from "@nestjs/common";
import {EditedField} from "../dod/dod.schema";
import {PldDocument} from "./pld.schema";

@Injectable()
export class PldHelper {

  public getEditedFields(beforePld: PldDocument, updatedPld: PldDocument): EditedField[] {
    const editedFields: EditedField[] = [];
    const fields = ['description', 'title', 'currentStep', 'promotion', 'status'];
    fields.forEach((field) => {
      if (beforePld[field] !== updatedPld[field]) {
        editedFields.push({
          name: field,
          lastValue: beforePld[field],
          value: updatedPld[field],
        })
      }
    });
    if (beforePld.manager.email !== updatedPld.manager.email) {
      editedFields.push({
        name: 'manager',
        lastValue: beforePld.manager.email,
        value: updatedPld.manager.email
      })
    }
    return editedFields;
  }

}
