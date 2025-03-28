import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export async function POST(request: Request) {
    try{
        const {coffeeShopId, name, location, rating, image} = await request.json();
        console.log('Received body:', {coffeeShopId, name, location});

        // Check if the coffee shop exists
        let coffeeShop = await prisma.coffeeShop.findUnique({
            where: { coffeeShopId },
        });

        if(!coffeeShopId||!name||!location){
            console.error("Missing fields");
            return NextResponse.json(
                {error:'Missing required fields'},
                {status: 400}
            );
        }

        if(!coffeeShop){
            coffeeShop = await prisma.coffeeShop.create({
                data:{
                    coffeeShopId,
                    name,
                    location,
                    rating:0,
                    image:""
                }
            });
        }

    }
    catch(error){
        console.error("Error adding new coffee shop", error);
        return NextResponse.json(
            {error:"Failed to add coffee shop"},
            {status: 500}
        );
    }
}
