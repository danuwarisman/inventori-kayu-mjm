import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum Role {
  MANAGER = 'MANAGER',
  ADMIN_KANTOR = 'ADMIN_KANTOR',
  ADMIN_LAPANGAN = 'ADMIN_LAPANGAN',
}

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
