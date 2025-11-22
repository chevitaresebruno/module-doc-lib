import { readFileSync } from "fs";

export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")            // normaliza EOL
    .replace(/\t/g, "    ")            // converte tabs em 4 espaços
    .replace(/\u00A0/g, " ")           // NBSP -> espaço normal
    .replace(/[ ]+$/gm, "")            // remove trailing spaces
    .trim();                           // remove espaços extras no início/fim
}

export function expectTextToBe(expectedString: string, filePath: string) {
  const fileContent = readFileSync(`./tests/preview/${filePath}`, "utf8");
  const normalizedFile = normalizeText(fileContent);
  const normalizedExpected = normalizeText(expectedString);

  expect(normalizedFile).toBe(normalizedExpected);
}

