// src/app/components/IcedCoffeeCard.tsx
import React from "react";

interface IcedCoffeeCardProps {
  id: number;
  name: string;
  price: number;  
  rating: number;
  description: string;
  image: string;
}

const IcedCoffeeCard: React.FC<IcedCoffeeCardProps> = ({
  name,
  price,
  rating,
  description,
  image
}) => {
  const formattedPrice = `£${price.toFixed(2)}`;  

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold text-[#6c584c] text-left">{name}</h3>
        <h3 className="text-lg font-bold text-[#dbb42c] text-right">{rating}</h3>
      </div>
      <p className="text-sm text-[#a98467]">{description}</p>

      {/* <p className="text-md text-gray-700">{formattedPrice}</p> 
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <p className="text-yellow-500">Rating: {rating}⭐</p>
      {image!==""&&(
        <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-4" />
      )} */}
    </div>
  );
};

export default IcedCoffeeCard;
