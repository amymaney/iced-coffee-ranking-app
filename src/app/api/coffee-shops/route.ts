import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export async function GET(request: Request){
    try{
        const {searchParams} = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? parseInt(limitParam, 10):undefined;

        const coffeeShops = await prisma.coffeeShop.findMany({
            take: limit,
            include:{
                _count: {
                    select: {icedCoffees: true},
                },
            },
            orderBy:{rating: 'desc'},
        });
        console.log("coffee shops >>", coffeeShops);
        return NextResponse.json(coffeeShops);
    }
    catch(error){
        console.error("Error fetching coffee shops:", error);
        return NextResponse.json({error: "Failed to fetch coffee shops"}, {status: 500});
    }
}
