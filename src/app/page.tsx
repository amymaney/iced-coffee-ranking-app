import React from "react";
import { coffeeShops } from "./data/coffeeShops";
import CoffeeShopComponent from "./components/CoffeeShop";

const Page: React.FC = () => {
  return(
    <div className="container mx-auto p-6">
      <nav className="bg-coffee-brown text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">Iced Coffee Rankings</a>
          <ul className="flex space-x-6">
            <li><a href="/menu" className="hover:text-cream-beige">Menu</a></li>
            <li><a href="/about" className="hover:text-cream-beige">About</a></li>
            <li><a href="/contact" className="hover:text-cream-beige">Contact</a></li>
          </ul>
        </div>
      </nav>

      <h1 className="text-4xl font-bold text-center mb-6">
        Coffee Shops & Iced Coffees
      </h1>
      <div>
        {coffeeShops.map((coffeeShop)=>(
          <CoffeeShopComponent key={coffeeShop.id} coffeeShop={coffeeShop} />
        ))}
      </div>
      <div >
        <h2>Delicious Iced Coffees</h2>
        <p>Our iced coffee menu features a range of tasty drinks made from the finest coffee beans...</p>
      </div>


    </div>
  );
};

export default Page;