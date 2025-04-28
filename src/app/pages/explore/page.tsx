'use client';
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";
import dynamic from 'next/dynamic';

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
    coffeeShopId: string;
    name: string;
    location: string;
    rating: number;
    lat:number;
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
};

// lazy loads map
const Map = dynamic(()=> import('../../components/Map'), {ssr: false});

export default function Explore(){
    const { data: session, status } = useSession();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!session;

    // storing AdvancedMarkerElement objects for each coffee shop (Google maps custom markers)
    const [markerMap, setMarkerMap] = useState<{ [id: number]: google.maps.marker.AdvancedMarkerElement }>({});
    


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
                
                <div className="w-full px-6">
                    <div className="w-1/2 min-w-[300px] lg:h-900px">
                        <Map 
                            coffeeShops={coffeeShops} 
                            onMarkersReady={setMarkerMap}
                            isLoggedIn={isLoggedIn}
                            className={`w-full rounded-3xl mt-1.5 mb-4 
                                h-[600px] `}
                        />
                    </div>
                </div>


                {/* <div className="text-[#6F4E37] flex flex-row gap-5 items-center w-full">
                    <div className="flex-1 flex justify-center items-center rounded-lg">
                        <h2 className="text-lg">explore iced coffees</h2>
                        
                    </div>

                    <div className="flex-1 flex justify-center items-center rounded-lg">
                        <h2 className="text-lg">explore coffee shops</h2>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

// Planned features
// Google map with markers for coffee shops - user can click marker to get pop up details 

// Search bars:
//     - search coffee shops by name 
//     - search coffees by name
//     - Filter list and zoom when searching

// Filter and sort:
//     - Filter:
//          - By rating
//          - By price range
//          
//     - Sort:
//          - Highest to lowest rated and vice versa
//          - Nearest to user location
//          - Newest to oldest reviews and vice versa

// Coffee reviews with user info, disply:
//     - Coffee name, price, description, rating, image
//     - The user who reviewed it
//     - Datetime of review

// Extras: dark mode? Skeleton loader? 


