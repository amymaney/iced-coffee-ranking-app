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
  user:{
    email: string;
    name: string;
    username: string;
  }
  onHover?: () => void;
  onLeave?: () => void;
}

export default function IcedCoffeeCard({
    name, price, rating, description, image, coffeeShop, onHover, onLeave, user
  }: IcedCoffeeCardProps){
    return(
      <div 
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={`bg-[#FFFCF4] flex-row flex justify-between px-7 py-5 shadow-md 
        rounded-4xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer
        border border-transparent hover:border-[#6F4E37] gap-3 ${image ? 'max-h-100' : 'max-h-50'}`}
      >
        <div>
          <h2 className="text-lg font-semibold text-[#6F4E37]">{name}</h2>
          <p className="text-sm text-gray-600">
            {coffeeShop.name} — £{price.toFixed(2)}
          </p>
          <p className="mt-1 text-sm">Rating: {rating}/5</p>
          {description&&(
            <p className="mt-2 text-sm text-gray-700">"{description}"</p>
          )}
          <p className="text-sm mt-2 text-[#6F4E37]">{user?.username}</p> 
        </div>
        <div>
          {image && (
            <img
              src={image}
              alt={`${name} image`}
              className="max-h-40 object-contain rounded-lg shadow"
            />
          )}
        </div>
      </div>
    )
  }