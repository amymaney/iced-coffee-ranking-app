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

export async function registerUser(email: string, password: string){
  try{
    console.log("Checking if user already exists...");
    const existingUser = await prisma.users.findUnique({
      where: {email},
    });

    if(existingUser){
      console.log("User already exists:", existingUser);
      return {error:"User already exists"};
    }

    console.log("Creating new user");
    const newUser = await prisma.users.create({
      data:{
        email,
        password
      }
    });

    console.log("New user created:", newUser);
    return {id:newUser.id, email:newUser.email};
  } catch(error){
    console.log("Error registering user:", error);
    return {error:"Registration failed"};
  }
}
