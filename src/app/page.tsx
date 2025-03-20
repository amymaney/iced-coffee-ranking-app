"use client";

import React from "react";
import { coffeeShops } from "./data/coffeeShops";
import CoffeeShopComponent from "./components/CoffeeShop";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const router = useRouter();
  return(
    <>
      <div className="min-h-screen bg-[#a98467] relative flex flex-col">
        <div className="w-full max-w-xl mx-auto p-10 bg-[#f0ead2] shadow-md mt-20 rounded-lg">
          <h1 className="text-4xl font-semibold text-center mb-6 text-[#432818]">london iced coffees</h1>
          <button 
            onClick={() => router.push("/newCoffee")}
            className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded w-60 cursor-pointer block mx-auto"
          >
            log a new iced coffee
          </button>
        </div>

          <div className="mb-20">
            {coffeeShops.map((coffeeShop)=>(
              <CoffeeShopComponent key={coffeeShop.id} coffeeShop={coffeeShop} />
            ))}
          </div>
        
      </div>
    </>

  );
};

export default Page;