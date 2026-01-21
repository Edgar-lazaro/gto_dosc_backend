import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { AdLdapService } from './ldap/ad-ldap.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly jwt: JwtService,
    private readonly adLdap: AdLdapService,
  ) {}

  async login(username: string, password: string) {
    let user = await this.repo.validateUser(username, password);

    if (!user && this.adLdap.isEnabled()) {
      const ok = await this.adLdap.validateCredentials(username, password);
      if (ok) {
        // No auto-create: only allow if the user already exists in our DB
        user = await this.repo.findUserByUsername(username);
        if (!user) {
          throw new UnauthorizedException('Usuario no autorizado');
        }
      }
    }

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: user.id,
      id: user.id,
      area: user.area,
      username: user.username ?? user.nombre,
      roles: user.roles ?? [],
      gerenciaId: user.gerenciaId ?? null,
      jefaturaId: user.jefaturaId ?? null,
      cargoId: user.cargoId ?? null,
      cargoNombre: user.cargoNombre ?? null,
      cargoNivel: user.cargoNivel ?? null,
    };

    return {
      token: this.jwt.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        area: user.area,
        roles: user.roles ?? [],
        gerenciaId: user.gerenciaId ?? null,
        jefaturaId: user.jefaturaId ?? null,
        cargoId: user.cargoId ?? null,
        cargoNombre: user.cargoNombre ?? null,
        cargoNivel: user.cargoNivel ?? null,
      },
    };
  }
}