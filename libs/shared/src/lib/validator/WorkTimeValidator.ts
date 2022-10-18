import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

type UserWorkTime = {
  users: string[];
  value: number;
  format: string,
}

export function IsValidWorkTimeArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidWorkTimeArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: UserWorkTime[], args: ValidationArguments) {
          if (value.length <= 0)
            return false;
          return !value.some((a) => {
            console.log(a.value);
            return a.users.length <= 0 || a.value === 0 || String(a.value) === '0' || a.users.some((u) => !RegExp(/^[0-9a-fA-F]{24}$/).test(u))
          })
        },
      },
    });
  };
}
