import "server-only";
import { randomInt } from "crypto";

// 6 caracteres alfanuméricos aleatorios, sin caracteres ambiguos (0/O, 1/I/L)
// y generados con un CSPRNG (no secuenciales, no adivinables).
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generarAccessCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ALFABETO[randomInt(ALFABETO.length)];
  }
  return code;
}
