import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export async function GET(){
    try{
        const coffeeShops = await prisma.coffeeShop.findMany({
            include:{icedCoffees: true},
            orderBy:{rating: 'desc'},
        });
        return NextResponse.json(coffeeShops);
    }
    catch(error){
        console.error("Error fetching coffee shops:", error);
        return NextResponse.json({error: "Failed to fetch coffee shops"}, {status: 500});
    }
}
