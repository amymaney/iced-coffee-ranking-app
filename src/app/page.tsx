import React from "react";
import { coffeeShops } from "./data/coffeeShops";
import CoffeeShopComponent from "./components/CoffeeShop";

const Page: React.FC = () => {
  return(
    <>
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-6">
            ICED COFFEE RANKER
          </h1>
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