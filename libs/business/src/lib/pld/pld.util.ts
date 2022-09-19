import { Organization, Pld, User } from "@pld/shared";
import { BadRequestException } from "@nestjs/common";

type Arg = [User, Organization, Pld];

export type CheckPldOptions = {

}


/**
 * @description Check if a user is in organization
 * @summary WARNING: You must only use this decorator with a function parameters beginning with a ObjectId and an Organization
 */
export function CheckPld(options?: CheckPldOptions) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;
    descriptor.value = function (...args: Arg) {
      if (args[2].org._id.toString() !== args[1]._id.toString())
        throw new BadRequestException('Organization don\'t have this Pld');
      return targetMethod.apply(this, args);
    }
    return descriptor;
  };
}
