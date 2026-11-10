import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      include: { role: true },
    });

    console.log('LOGIN DEBUG:', {
  username: dto.username,
  userFound: !!user,
  passwordMatch: user
    ? await bcrypt.compare(dto.password, user.password)
    : false,
});

if (!user || !(await bcrypt.compare(dto.password, user.password))) {
  throw new UnauthorizedException('Username atau password salah');
}

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role.nama.toUpperCase(),
      },
    };
  }
}