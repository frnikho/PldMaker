import { Organization, User } from "@pld/shared";
import { UnauthorizedException } from "@nestjs/common";

type Arg = [User, Organization];

type OrgRole = 'member' | 'owner' | 'any';

export const hasJoinOrg = (userId: string, org: Organization): boolean => isOrgOwner(userId, org) || isOrgMember(userId, org);
export const isOrgMember = (userId: string, org: Organization): boolean => org.members.some((u) => u._id.toString() === userId);
export const isOrgOwner = (userId: string, org: Organization): boolean => org.owner._id.toString() === userId;

/**
 * Check if a user is in the organization
 * @param userId string
 * @param org Organization
 * @param role OrgRole
 */
export const checkOrgPermission = (userId: string, org: Organization, role: OrgRole = 'any') => {
  if (role === 'any') {
    if (!hasJoinOrg(userId, org))
      throw new UnauthorizedException(`You're currently not members in this organization !`);
  } else if (role === 'owner') {
    if (!isOrgOwner(userId, org))
      throw new UnauthorizedException(`You're currently not members in this organization !`);
  } else if (role === 'member') {
    if (!isOrgMember(userId, org))
      throw new UnauthorizedException(`You're currently not members in this organization !`);
  }
}

/**
 * CheckOrgPerm options
 */
export type CheckOrgPermOptions = {
  role: OrgRole
}

/**
 * @description Check if a user is in organization
 * @summary WARNING: You must only use this decorator with a function parameters beginning with a ObjectId and an Organization
 */
export function CheckOrgPerm(options: CheckOrgPermOptions = {role: 'any'}) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;
    descriptor.value = function (...args: Arg) {
      checkOrgPermission(args[0]._id.toString(), args[1], options.role);
      return targetMethod.apply(this, args);
    }
    return descriptor;
  };
}
