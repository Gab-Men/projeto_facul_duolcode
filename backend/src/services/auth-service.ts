import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "../errors/app-error.js";
import { loginSchema, profileSchema, registerSchema } from "../domain/validation.js";
import type { UserRepository } from "../repositories/contracts.js";
import { publicUser, type AuthSession, type PublicUser } from "../domain/user.js";
import { hashPassword, verifyPassword } from "./password.js";

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly secret: string,
  ) {}
  async register(input: unknown): Promise<PublicUser> {
    const { password, ...data } = registerSchema.parse(input);
    if (await this.users.findByEmail(data.email)) throw new ConflictError("E-mail já cadastrado.");
    return publicUser(await this.users.create({ ...data, passwordHash: await hashPassword(password) }));
  }
  async login(input: unknown): Promise<AuthSession> {
    const data = loginSchema.parse(input);
    const user = await this.users.findByEmail(data.email);
    if (!user || !(await verifyPassword(data.password, user.passwordHash)))
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    const token = jwt.sign({}, this.secret, {
      subject: String(user.id),
      expiresIn: "2h",
      algorithm: "HS256",
      issuer: "duolcode",
      audience: "duolcode-web",
    });
    return { token, user: publicUser(user) };
  }
  async authenticate(header?: string): Promise<PublicUser> {
    if (!header?.startsWith("Bearer "))
      throw new UnauthorizedError("Entre na sua conta para continuar.");
    try {
      const payload = jwt.verify(header.slice(7), this.secret, {
        algorithms: ["HS256"],
        issuer: "duolcode",
        audience: "duolcode-web",
      });
      if (typeof payload === "string" || !payload.sub) throw new Error("invalid token");
      const user = await this.users.findById(Number(payload.sub));
      if (!user) throw new Error("missing user");
      return publicUser(user);
    } catch {
      throw new UnauthorizedError("Sua sessão expirou. Entre novamente.");
    }
  }
  async update(id: number, input: unknown): Promise<PublicUser> {
    const { password, ...data } = profileSchema.parse(input);
    return publicUser(await this.users.update(id, { ...data, passwordHash: await hashPassword(password) }));
  }
}
