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
  
  const CoffeeShopCoffeeOnly: React.FC<CoffeeShopProps> = ({ coffeeShop, onHover, onLeave }) => {
    return (
      <div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="w-full bg-[#FFFCF4] px-6 py-5 rounded-3xl flex justify-between items-center transition-all duration-200 cursor-pointer"
      >
        <div>
          <h2 className="text-[#6F4E37] text-xl font-extrabold">{coffeeShop.name}</h2>
          <h3 className="text-[#6F4E37] text-lg">{coffeeShop.location}</h3>
          <h3 className="text-md" style={{ color: "rgba(111, 78, 55, 0.75)" }}>
            {coffeeShop._count.icedCoffees} iced coffee
            {coffeeShop._count.icedCoffees !== 1 && "s"} logged
          </h3>
        </div>
        <div>
          <h2 className="text-right text-[#EFBB2C] text-4xl font-bold">{coffeeShop.rating.toFixed(2)}</h2>
        </div>
      </div>
    );
  };
  
export default CoffeeShopCoffeeOnly;

