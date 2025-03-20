
export interface CoffeeShop {
    id: number;
    name: string;
    rating: number;
    location: string;
    image: string;
    icedCoffees: IcedCoffee[];
}

export interface IcedCoffee {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string;
    image: string;
}

export const coffeeShops: CoffeeShop[] = [
    {
        id: 1,
        name: "Coffee Shop A",
        rating: 4.77, 
        location: "Walthamstow",
        image: "",
        icedCoffees:[
            {
                id: 1,
                name: "Iced Latte",
                price: 3.60,
                rating: 4.6,
                description: "Smooth, rich iced latte",
                image: ""
            },
            {
                id: 2,
                name: "Iced Mocha",
                price: 3.80,
                rating: 4.8,
                description: "Delicious and not too sweet",
                image: ""
            },
            {
                id: 3,
                name: "Iced Caramel Frappe Latte",
                price: 4.15,
                rating: 4.9,
                description: "Nice and creamy",
                image: ""
            },
        ]
    },
    {
        id: 2,
        name: "Coffee Shop B",
        rating: 3.80, 
        location: "Brixton",
        image: "",
        icedCoffees:[
            {
                id: 1,
                name: "Iced Latte",
                price: 4.2,
                rating: 3.8,
                description: "Yummy but ice was almost fully melted when recieved",
                image: ""
            },
        ]
    },
    {
        id: 3,
        name: "Coffee Shop C",
        rating: 4.88, 
        location: "Bermondsey",
        image: "",
        icedCoffees:[
            {
                id: 1,
                name: "Iced Caramel Latte",
                price: 3.95,
                rating: 4.8,
                description: "Sweet and creamy with a rich espresso base",
                image: ""
            },
            {
                id: 2,
                name: "Iced Vanilla Bean Latte",
                price: 3.95,
                rating: 4.95,
                description: "Made with real vanilla bean syrup",
                image: ""
            },
        ]
    },
]