import React from "react";

export interface IcedCoffeeCardProps {
  id: number;
  name: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  coffeeShop: {
    name: string;
  };
}

export default function IcedCoffeeCard({
    name, price, rating, description, image, coffeeShop,
  }: IcedCoffeeCardProps){
    return(
      <div className="bg-[#FFFCF4] flex flex-row justify-between w-full p-5 shadow-md rounded-4xl">
        <div>
          <h2 className="text-lg font-semibold text-[#6F4E37]">{name}</h2>
          <p className="text-sm text-gray-600">
            {coffeeShop.name} — £{price.toFixed(2)}
          </p>
          <p className="mt-1 text-sm">Rating: {rating}/5</p>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        <div>
          {image && (
            <img
              src={image}
              alt={`${name} image`}
              className="h-36 object-contain rounded-lg shadow"
            />
          )}
        </div>
      </div>
    )
  }