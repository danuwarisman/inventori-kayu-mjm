import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './roles.decorator';

/**
 * Nama role di database bisa ditulis "Manager", "Admin Kantor",
 * "ADMIN_KANTOR", dsb. Normalisasi dilakukan dengan membuang semua karakter
 * non-alfanumerik agar perbandingan konsisten.
 */
const ROLE_ALIASES: Record<string, Role> = {
  MANAGER: Role.MANAGER,
  MANAJER: Role.MANAGER,
  ADMIN: Role.ADMIN_KANTOR,
  ADMINKANTOR: Role.ADMIN_KANTOR,
  ADMINLAPANGAN: Role.ADMIN_LAPANGAN,
};

function normalizeRole(raw: string): Role | null {
  const key = raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return ROLE_ALIASES[key] ?? null;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Informasi role pengguna tidak ditemukan');
    }

    const role = normalizeRole(user.role);

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException(
        'Anda tidak memiliki hak akses untuk tindakan ini',
      );
    }

    return true;
  }
}
