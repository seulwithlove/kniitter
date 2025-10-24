import { PrismaClient } from "@/lib/generated/prisma/client";

// Singleton
const newInstance = () => new PrismaClient();

// biome-ignore lint/suspicious/noShadowRestrictedNames: too many connections problem
declare const globalThis: {
  prismaGlobal: ReturnType<typeof newInstance>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? newInstance();
export default prisma;

globalThis.prismaGlobal = prisma; // set
