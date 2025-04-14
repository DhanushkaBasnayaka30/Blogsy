import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/lib/prisma"; // your prisma client instance

export function CustomPrismaAdapter(prisma): Adapter {
  const defaultAdapter = PrismaAdapter(prisma);

  return {
    ...defaultAdapter,

    async createUser(data) {
      const user = await prisma.user.create({
        data: {
          ...data,
          role: "user",  
        },
      });
      return user;
    },
  };
}
