import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authenticateUser(email: string, password: string) {
  // Find user by email
  const user = await prisma.users.findUnique({
    where: { email },
  });

  console.log('User found in the database:', user);

  // If user exists, check password
  if (user && user.password === password) {  // Compare plain text password
    return { id: String(user.id), email: user.email };  // Ensuring the id is a string
  }

  return null;  // If no user or incorrect password
}
