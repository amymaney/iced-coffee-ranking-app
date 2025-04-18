import { render } from "@testing-library/react";
import IcedCoffeeCard from "@/app/components/IcedCoffeeCard";

const mockIcedCoffee = {
    id: 1,
    name: "Iced Vanilla Latte",
    price: 3.60,
    rating: 3,
    description:"Very yummy",
    image:"",
}

describe("IcedCoffeeCard Component", ()=>{
    test('renders the iced coffee name', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        // Checks name is displayed
        const icedCoffeeNameElement = document.querySelector("#coffee-name");
        expect(icedCoffeeNameElement).toBeInTheDocument();
    });

    test('renders the iced coffee rating', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        // Checks name is displayed
        const icedCoffeeRatingElement = document.querySelector("#coffee-rating");
        expect(icedCoffeeRatingElement).toBeInTheDocument();
    });

    test('renders the iced coffee description', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        // Checks name is displayed
        const icedCoffeeDescriptionElement = document.querySelector("#coffee-description");
        expect(icedCoffeeDescriptionElement).toBeInTheDocument();
    });
});