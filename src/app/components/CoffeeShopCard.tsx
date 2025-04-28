import React from "react";

interface CoffeeShopProps {
    coffeeShop: {
      id: number;
      name: string;
      location: string;
      rating: number;
      icedCoffees: {
        id: number;
        name: string;
        price: number;
        rating: number;
        description: string;
        image: string;
      }[];
      _count: {
        icedCoffees: number;
      };
    };
    onHover?: () => void;
    onLeave?: () => void;
  }
  
  const CoffeeShopCard: React.FC<CoffeeShopProps> = ({ coffeeShop, onHover, onLeave }) => {
    return (
      <div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="w-full bg-[#FFFCF4] shadow-md lg:py-5 px-6 py-4 rounded-4xl flex justify-between items-center transition-all 
          duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border border-transparent hover:border-[#6F4E37]"
      >
        <div>
          <h2 className="text-[#6F4E37] lg:text-xl text-lg font-extrabold">{coffeeShop.name}</h2>
          <p className="text-[#6F4E37] text-md lg:text-lg">{coffeeShop.location}</p>
          <p className="text-md" style={{ color: "rgba(111, 78, 55, 0.75)" }}>
            {coffeeShop._count.icedCoffees} iced coffee
            {coffeeShop._count.icedCoffees !== 1 && "s"} logged
          </p>
        </div>
        <div>
          <p className="text-right text-[#EFBB2C] text-4xl font-bold">{coffeeShop.rating.toFixed(2)}</p>
        </div>
      </div>
    );
  };
  
export default CoffeeShopCard;

