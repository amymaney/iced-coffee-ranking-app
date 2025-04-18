import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(){
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          icedCoffees: {
            include: {
              coffeeShop: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    
      return NextResponse.json(user?.icedCoffees || []);
}