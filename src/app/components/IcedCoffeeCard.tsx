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
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-lg text-gray-700">{formattedPrice}</p> 
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <p className="text-yellow-500">Rating: {rating}⭐</p>
      {image!==""&&(
        <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-4" />
      )}
    </div>
  );
};

export default IcedCoffeeCard;
