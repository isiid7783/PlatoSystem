import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export const ENV = {
  PORT: process.env.PORT || "3001",

  DATABASE_URL: required("DATABASE_URL"),

  JWT_SECRET: required("JWT_SECRET"),

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",

  ENCRYPTION_KEY: required("ENCRYPTION_KEY"), // 32文字以上推奨
};

