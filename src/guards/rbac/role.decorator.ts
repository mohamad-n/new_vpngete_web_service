import { SetMetadata } from '@nestjs/common';
import { SessionRole } from './role.enum';

export const ROLES_KEY = 'roles';
export const SessionRoles = (...roles: SessionRole[]) => SetMetadata(ROLES_KEY, roles);
