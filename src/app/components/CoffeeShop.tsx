import React from "react";
import IcedCoffeeCard from "./IcedCoffeeCard";
import { CoffeeShop } from "../data/coffeeShops";

interface CoffeeShopProps {
    coffeeShop: CoffeeShop;
}

const CoffeeShopComponent: React.FC<CoffeeShopProps> = ({ coffeeShop }) => {
    return(
        <div className="w-full max-w-2xl mx-auto p-8 bg-[#f0ead2] shadow-md mt-5 rounded-lg mb-5">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-left text-[#432818]">
                        {coffeeShop.name}
                    </h2>
                    <p className="text-left text-[#6c584c]">{coffeeShop.location}</p>
                </div>
                <h1 className="text-right text-[#dbb42c] text-5xl font-bold">{coffeeShop.rating}</h1>
            </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {coffeeShop.icedCoffees.map((icedCoffee)=>(
                <IcedCoffeeCard
                    key={icedCoffee.id}
                    id={icedCoffee.id}
                    name={icedCoffee.name}
                    price={icedCoffee.price}
                    rating={icedCoffee.rating}
                    description={icedCoffee.description}
                    image={icedCoffee.image}
                />
            ))}
        </div>
        </div>
    );
};

export default CoffeeShopComponent;