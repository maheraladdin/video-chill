import { Prisma } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { hashPassword } from "~/server/password";
import { prisma } from "~/server/db";

const signupSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Enter a valid email and a password with at least 8 characters.",
    });
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "An account with this email already exists." });
  }

  try {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(parsed.data.password),
      },
    });
    return res.status(201).json({ ok: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    console.error("Account signup failed", error);
    return res
      .status(500)
      .json({ error: "Unable to create your account right now." });
  }
}