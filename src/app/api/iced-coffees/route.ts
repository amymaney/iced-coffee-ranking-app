import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export async function POST(request: Request) {
    try{
        const {name, price, rating, coffeeShopId, description, image, location, coffeeShopName} = await request.json();
        console.log("Received body:", { name, price, rating, description, image, coffeeShopId, location, coffeeShopName });

        const priceFloat = parseFloat(price);

        if (isNaN(priceFloat)) {
            return NextResponse.json(
              { error: 'Price must be a valid number' },
              { status: 400 }
            );
        }

        if(!name||!price||!rating||!coffeeShopId||!location||!coffeeShopName){
            console.error("Missing fields");
            return NextResponse.json(
                {error:'Missing required fields'},
                {status: 400}
            );
        }

        // Check if the coffee shop exists
        let coffeeShop = await prisma.coffeeShop.findUnique({
            where: { coffeeShopId },
        });

        if(!coffeeShop){
            const newCoffeeShop = await prisma.coffeeShop.create({
                data:{
                    coffeeShopId,
                    name: coffeeShopName,
                    location,
                    rating:rating,
                    image:""
                }
            });

            console.log('New coffee created:', newCoffeeShop);
        }
        else{
            console.log('Coffee shop already exists');
        }

        const newCoffee = await prisma.icedCoffee.create({
            data:{
                name,
                price:priceFloat,
                rating,
                coffeeShopId,
                description,
                image,
            }
        });

        const updatedRating = await prisma.icedCoffee.aggregate({
            where: { coffeeShopId: coffeeShopId},
            _avg: {rating: true},
        });

        await prisma.coffeeShop.update({
            where: {coffeeShopId: coffeeShopId},
            data: {rating: updatedRating._avg.rating ?? 0},
        });

        console.log('New coffee created:', newCoffee);

        return NextResponse.json(newCoffee, {status: 201});
    }
    catch(error){
        console.error('Error adding new iced coffee:', error);
        return NextResponse.json(
            {error: 'Failed to add iced coffee'},
            {status: 500}
        );
    }
}