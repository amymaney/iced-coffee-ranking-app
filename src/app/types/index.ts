
export type CoffeeShop = {
    id: number;
    coffeeShopId: string;
    name: string;
    rating: number;
    location: string;
    lat: number;
    lng: number;
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
}

export type Coffee = {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string;
    image:string;
    coffeeShop: {
      id: number;
      name: string;
      coffeeShopId:string;
      lat: number;
      lng: number;
      location: string;
      rating: number;
      icedCoffees:{
        id: number;
        name: string;
        price: number;
        rating: number;
        description: string;
        image: string;
      }[];
      _count:{
        icedCoffees:number;
      }
    };
    userId: string;
    user:{
      name: string;
      email: string;
      username: string;
    };
}