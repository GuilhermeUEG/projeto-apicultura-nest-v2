import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { BusinessException } from "../common/exceptions/business.exception";
import { User } from "../users/entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, "senha"> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BusinessException(
        "E-mail ou senha incorretos.",
        "AUTH_INVALID_CREDENTIALS",
      );
    }

    const isMatch = await bcrypt.compare(pass, user.senha);
    if (!isMatch) {
      throw new BusinessException(
        "E-mail ou senha incorretos.",
        "AUTH_INVALID_CREDENTIALS",
      );
    }

    if (!user.ativo) {
      throw new BusinessException(
        "Conta aguardando liberação do administrador",
        "AUTH_USER_INACTIVE",
      );
    }

    const { senha, ...result } = user;
    return result;
  }

  async login(user: Omit<User, "senha">): Promise<{ access_token: string }> {
    // `sub` é a claim padrão do JWT para o id do usuário; `id` é incluído
    // explicitamente para atender ao requisito (payload com id, email e nome).
    const payload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
