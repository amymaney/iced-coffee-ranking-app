import { render, screen } from "@testing-library/react";
import CoffeeShopCoffeeCard from "@/app/components/CoffeeShopCard";

const mockCoffeeShop = {
    id: 1,
    name: "The big bean",
    location: "24 Shaftsbury Avenue, London, EC2 4RT",
    rating: 4.33,
    _count: {
        icedCoffees: 4
    }
};

describe("CoffeeShopCard Component", ()=> {
    test('renders coffee shop name as a heading', ()=>{
        // render(<CoffeeShopCoffeeCard />)
    });
});