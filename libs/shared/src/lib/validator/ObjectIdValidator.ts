import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsObjectID(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsObjectID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return new RegExp(/^[0-9a-fA-F]{24}$/).test(value);
        },
      },
    });
  };
}
