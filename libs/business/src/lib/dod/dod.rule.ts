import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'IsUserAlreadyExistConstraint' })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

  validate(userName: any, args: ValidationArguments) {
    console.log('ABC');
    return false;
  }
}


export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
