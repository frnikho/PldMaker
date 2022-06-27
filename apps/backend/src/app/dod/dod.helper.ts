import {Dod, EditedField} from "./dod.schema";

export class DodHelper {

  public getEditedFields(beforeDod: Dod, updatedDod: Dod): EditedField[] {
    const editedFields: EditedField[] = [];
    const fields = ['description', 'title', 'skinOf', 'want', 'version']
    fields.forEach((field) => {
      console.log(beforeDod[field], updatedDod[field]);
      if (beforeDod[field] !== updatedDod[field]) {
        editedFields.push({
          name: field,
          value: updatedDod[field],
          lastValue: beforeDod[field],
        })
      }
    })
    if (beforeDod.estimatedWorkTime !== updatedDod.estimatedWorkTime) {
      //TODO
    }
    if (beforeDod.descriptionOfDone.join(', ') !== updatedDod.descriptionOfDone.join(', ')) {
      editedFields.push({
        name: 'descriptionOfDone',
        value: updatedDod.descriptionOfDone.join(', '),
        lastValue: beforeDod.descriptionOfDone.join(', '),
      })
    }
    return editedFields;
  }

}
