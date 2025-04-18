import {render, screen} from "@testing-library/react";
import CoffeeShopComponent from "@/app/components/CoffeeShop";

const mockCoffeeShop = {
    id: 1,
    name:"Test coffee shop",
    location:"12 Praed Street, Paddington, W3 5LG",
    rating: 4.5,
    image:"",
    icedCoffees:[
        {id: 1, name:"Iced pistachio latte", price:3.95, rating:4, description: "Great real pistachio flavour", image:""},
        {id: 2, name: "Iced mocha", price: 4.05, rating: 5, description: "", image:""}
    ]
};

describe("CoffeeShop Component", ()=>{
    test('renders the cofee shop name', ()=>{
        render(<CoffeeShopComponent coffeeShop={mockCoffeeShop} />);
        // Checks name is displayed
        const coffeeShopNameElement = document.querySelector('#coffee-shop-name');
        expect(coffeeShopNameElement).toBeInTheDocument();
    });

    test('renders the cofee shop location', ()=>{
        render(<CoffeeShopComponent coffeeShop={mockCoffeeShop} />);
        // Checks location is displayed
        const coffeeShopLocationElement = document.querySelector('#coffee-shop-location');
        expect(coffeeShopLocationElement).toBeInTheDocument();
    });

    test('renders the cofee shop rating', ()=>{
        render(<CoffeeShopComponent coffeeShop={mockCoffeeShop} />);
        // Checks rating is displayed
        const coffeeShopRatingElement = document.querySelector('#coffee-shop-rating');
        expect(coffeeShopRatingElement).toBeInTheDocument();
    });
});
