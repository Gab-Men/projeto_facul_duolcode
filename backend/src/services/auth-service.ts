import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error.js";
import { loginSchema, profileSchema, publicUser, registerSchema } from "../domain/validation.js";
import type { UserRepository } from "../repositories/contracts.js";
const derive = promisify(scrypt);
async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await derive(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}
async function verify(password: string, stored: string): Promise<boolean> {
  const [salt, expected] = stored.split(":");
  const actual = (await derive(password, salt, 64)) as Buffer;
  const expectedBytes = Buffer.from(expected, "hex");
  return actual.length === expectedBytes.length && timingSafeEqual(actual, expectedBytes);
}
export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly secret: string,
  ) {}
  async register(input: unknown) {
    const { password, ...data } = registerSchema.parse(input);
    if (await this.users.findByEmail(data.email)) throw new AppError(409, "E-mail já cadastrado.");
    return publicUser(await this.users.create({ ...data, passwordHash: await hash(password) }));
  }
  async login(input: unknown) {
    const data = loginSchema.parse(input);
    const user = await this.users.findByEmail(data.email);
    if (!user || !(await verify(data.password, user.passwordHash)))
      throw new AppError(401, "E-mail ou senha incorretos.");
    const token = jwt.sign({}, this.secret, {
      subject: String(user.id),
      expiresIn: "2h",
      algorithm: "HS256",
      issuer: "duolcode",
      audience: "duolcode-web",
    });
    return { token, user: publicUser(user) };
  }
  async authenticate(header?: string) {
    if (!header?.startsWith("Bearer "))
      throw new AppError(401, "Entre na sua conta para continuar.");
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
      throw new AppError(401, "Sua sessão expirou. Entre novamente.");
    }
  }
  async update(id: number, input: unknown) {
    const { password, ...data } = profileSchema.parse(input);
    return publicUser(await this.users.update(id, { ...data, passwordHash: await hash(password) }));
  }
}
