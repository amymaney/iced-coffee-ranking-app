import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest){
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);

  // parse query parameters
  const ratingParam = url.searchParams.get("rating");
  const noUser = url.searchParams.get("noUser");
  const limitParam = url.searchParams.get("limit");
  const excludeShopIdsParam = url.searchParams.get("excludeShopIds");
  console.log('excludedshopparm', excludeShopIdsParam);

  const rating = ratingParam ? parseInt(ratingParam):undefined;
  const limit = limitParam ? parseInt(limitParam) : undefined;

  // create array of excluded shop id numbers
  const excludeShopIds = excludeShopIdsParam
    ? excludeShopIdsParam.split(",").map(id=>id.trim()).filter(id=>id.length>0)
    : [];

  // For when no user specified
  if(noUser==="true"){
    const coffees = await prisma.icedCoffee.findMany({
      where:{
        ...(rating ? {rating}: {}),
        ...(excludeShopIds.length > 0 ? {coffeeShopId: {notIn: excludeShopIds}} : {}),
      },
      include:{
        coffeeShop: true,
        user: true
      },
    });

    console.log("coffees >>", coffees);

    // pick random
    const shuffled = coffees.sort(() => 0.5 - Math.random());
    const result = limit ? shuffled.slice(0, limit) : shuffled;

    return NextResponse.json(result);
  }

  // find for logged in user
  if(!session?.user?.email){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({
    where:{
      email: session.user.email,
    },
    include:{
      icedCoffees:{
        where:{
          ...(rating ? {rating}:{}),
        },
        include:{
          coffeeShop: true,
        },
        orderBy:{
          createdAt: 'desc',
        },
        ...(limit ? { take: limit } : {}),
      },
    },
  });

  // console.log('coffees >>', user?.icedCoffees);

  return NextResponse.json(user?.icedCoffees || []);
}

export async function POST(request: Request) {
  try{

      const session = await getServerSession(authOptions);
      if(!session||!session.id){
          return NextResponse.json({error:"Unauthorised"}, {status: 401});
      }

      const {name, price, rating, coffeeShopId, description, image, location, coffeeShopName, userId, lat, lng} = await request.json();
      console.log("Received body:", { name, price, rating, description, image, coffeeShopId, location, coffeeShopName, userId, lat, lng });

      const priceFloat = parseFloat(price);

      if (isNaN(priceFloat)) {
        return NextResponse.json(
          { error: 'Price must be a valid number' },
          { status: 400 }
        );
    }

      if(!name||!price||!rating||!coffeeShopId||!location||!coffeeShopName||lat==undefined||lng===undefined){
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
            lat,
            lng,
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
          userId: session.id
        }
      });

      const updatedRating = await prisma.icedCoffee.aggregate({
        where: { coffeeShopId },
        _avg: {rating: true},
      });

      await prisma.coffeeShop.update({
        where: { coffeeShopId },
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