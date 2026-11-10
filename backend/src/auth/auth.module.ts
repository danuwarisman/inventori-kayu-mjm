import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * TODO(auth): JwtStrategy dan Passport sudah terdaftar di sini, tetapi guard-nya
 * belum dipasang di mana pun. Selama belum ada APP_GUARD / @UseGuards, seluruh
 * endpoint (supplier, log, sawmill, dry-kiln, dst.) masih dapat diakses tanpa JWT.
 *
 * Langkah berikutnya:
 * 1. Daftarkan APP_GUARD AuthGuard('jwt') di AppModule.
 * 2. Tambahkan decorator @Public() untuk endpoint publik seperti POST /auth/login.
 * 3. Tambahkan RoleGuard untuk aksi khusus manager/admin.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
          throw new Error('JWT_SECRET belum diatur di file .env');
        }

        return {
          secret,
          signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}