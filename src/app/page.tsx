import React from "react";
import { coffeeShops } from "./data/coffeeShops";
import CoffeeShopComponent from "./components/CoffeeShop";
import Link from "next/link";

const Page: React.FC = () => {
  return(
    <>
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-6">
            ICED COFFEE RANKER
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Discover and rank the best iced coffees!
          </p>

          <div className="flex justify-center">
            <Link href="/newCoffee">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Log a New Iced Coffee
              </button>
            </Link>
          </div>

          <div>
            {coffeeShops.map((coffeeShop)=>(
              <CoffeeShopComponent key={coffeeShop.id} coffeeShop={coffeeShop} />
            ))}
          </div>

        </div>
    </>

  );
};

export default Page;