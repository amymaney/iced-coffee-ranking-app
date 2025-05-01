import { render, screen } from "@testing-library/react";
import IcedCoffeeCard from "@/app/components/IcedCoffeeCard";

const mockIcedCoffee = {
    id: 1,
    name: "Iced Vanilla Latte",
    price: 3.60,
    rating: 3,
    description:"Very yummy",
    image:"https://res.cloudinary.com/de59m0cso/image/upload/v1745620150/vb7lbeuml7an9ljegpif.jpg",
    coffeeShop:{
        name: "Coffee & Friends"
    },
    user:{
        email:"randomemail@gmail.com",
        name:"Test user",
        username:"coffee-gal-89"
    }
};

describe("IcedCoffeeCard Component", ()=>{
    test('renders the iced coffee name as a heading', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        const heading = screen.getByRole("heading", {name: mockIcedCoffee.name});
        expect(heading).toBeInTheDocument();
    });

    test('displays coffee shop name and price', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        const shopAndPrice = screen.getByText(`${mockIcedCoffee.coffeeShop.name} — £${mockIcedCoffee.price.toFixed(2)}`);
        expect(shopAndPrice).toBeInTheDocument();
    });

    test('displays coffee rating', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        const rating = screen.getByText(`Rating: ${mockIcedCoffee.rating}/5`);
        expect(rating).toBeInTheDocument();
    });

    test('displays coffee description', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        const description = screen.getByText(mockIcedCoffee.description);
        expect(description).toBeInTheDocument();
    });

    test('renders coffee image', ()=>{
        render(<IcedCoffeeCard {...mockIcedCoffee}/>);
        const image = screen.getByRole("img", { name: /Iced Vanilla Latte image/i});
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", mockIcedCoffee.image);
    });
});