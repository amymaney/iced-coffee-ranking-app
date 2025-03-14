import React from "react";
import IcedCoffeeCard from "./IcedCoffeeCard";
import { CoffeeShop } from "../data/coffeeShops";

interface CoffeeShopProps {
    coffeeShop: CoffeeShop;
}

const CoffeeShopComponent: React.FC<CoffeeShopProps> = ({ coffeeShop }) => {
    return(
        <div className="p-4 border rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-2">{coffeeShop.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{coffeeShop.location}</p>
            <p className="text-sm text-gray-600">{coffeeShop.rating}</p>
            {coffeeShop.image!==""&&(
                <img 
                    src={coffeeShop.image}
                    alt={coffeeShop.name}
                    className="w-full h-60 object-cover rounded-md mb-4"
                />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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