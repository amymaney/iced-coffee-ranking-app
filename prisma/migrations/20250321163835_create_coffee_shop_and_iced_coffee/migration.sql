-- CreateTable
CREATE TABLE "CoffeeShop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "CoffeeShop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IcedCoffee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "coffeeShopId" INTEGER NOT NULL,

    CONSTRAINT "IcedCoffee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IcedCoffee" ADD CONSTRAINT "IcedCoffee_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
