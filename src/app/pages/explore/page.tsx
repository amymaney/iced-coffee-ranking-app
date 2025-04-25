'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";

type Coffee = {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string;
    coffeeShop: {
      name: string;
      coffeeShopId:string;
      lat: number;
      lng: number;
    };
    userId: string;
    user:{
        name: string;
    };
};

type CoffeeShop = {
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

export default function Explore(){
    const { data: session, status } = useSession();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!session;

    useEffect(()=> {
        const fetchCoffees = async () => {
            const res = await fetch("/api/coffees?noUser=true");
            if(res.ok){
                const data = await res.json();
                setCoffees(data);
            }
        };  

        const fetchCoffeeShops = async () => {
            const res = await fetch("/api/coffee-shops");
            if(res.ok){
                const data = await res.json();
                setCoffeeShops(data);
            }
            setLoading(false);
        };

        fetchCoffees();
        fetchCoffeeShops();
    },[]);

    if (status === "loading" || loading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-[#fffcf4]">
            <div className="loader">Loading...</div>
          </div>
        );
    }

    return(
        <div>
            <Header isLoggedIn={isLoggedIn} activePage="explore" />
            <div className="bg-[#f7edda] min-h-screen w-full flex flex-col items-center pt-3">
                <h3 className="hidden sm:block text-[#6F4E37] self-end pr-6">{session?.email}</h3>
                <h1 className="text-[#6F4E37] text-center text-4xl font-roboto-mono pb-3">explore</h1>
            </div>
        </div>
    )
}