/*
  Warnings:

  - A unique constraint covering the columns `[coffeeShopId]` on the table `CoffeeShop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coffeeShopId` to the `CoffeeShop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IcedCoffee" DROP CONSTRAINT "IcedCoffee_coffeeShopId_fkey";

-- AlterTable
ALTER TABLE "CoffeeShop" ADD COLUMN     "coffeeShopId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IcedCoffee" ALTER COLUMN "coffeeShopId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeShop_coffeeShopId_key" ON "CoffeeShop"("coffeeShopId");

-- AddForeignKey
ALTER TABLE "IcedCoffee" ADD CONSTRAINT "IcedCoffee_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("coffeeShopId") ON DELETE RESTRICT ON UPDATE CASCADE;
