import {SetMetadata} from "@nestjs/common";

export const MUST_BE_OWNER = 'MustBeOrgOwner';
export const MustBeOrgOwner = () => SetMetadata(MustBeOrgOwner, true);
