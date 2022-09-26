import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsGoodSection(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsGoodSection',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return !(value.includes('..') || !value.match('^\\d+(\\.\\d+)+$'));
        },
      },
    });
  };
}
