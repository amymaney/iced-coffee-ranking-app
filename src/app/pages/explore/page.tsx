'use client';
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";
import dynamic from 'next/dynamic';
import type {Coffee, CoffeeShop} from "../../types";
import CoffeeShopCard from "@/app/components/CoffeeShopCard";
import IcedCoffeeCard from "@/app/components/IcedCoffeeCard";

// lazy loads map
const Map = dynamic(()=> import('../../components/Map'), {ssr: false});

export default function Explore(){
    const { data: session, status } = useSession();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!session;
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const coffeesPerLoad = 4;
    
    const filteredCoffees = coffees.filter(coffee => coffee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const visibleCoffees = filteredCoffees.slice(0, visibleCount);

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

    // Prevents unneccessary calls when all items are loaded
    useEffect(() => {
        if (visibleCount >= filteredCoffees.length) return;
    }, [visibleCount, filteredCoffees.length]);
   
    // Mouse hover handlers to scale up/down the map markers
    const handleMouseEnter = (id: number) => {
        const marker = markerMap[id];
        if (marker && marker.content instanceof HTMLElement) {
        marker.content.style.transform = "scale(1.5)"; 
        marker.content.style.transition = "transform 0.2s ease";
        }
    };
    const handleMouseLeave = (id: number) => {
        const marker = markerMap[id];
        if (marker && marker.content instanceof HTMLElement) {
        marker.content.style.transform = "scale(1)";
        }
    };

    // infinite scroll for the coffees
    const handleScroll = (e: React.UIEvent<HTMLDivElement>)=> {
        const target = e.currentTarget;
        // if user near bottom, load more items
        if(target.scrollTop + target.clientHeight >= target.scrollHeight-50){
            setVisibleCount((prev)=>
                Math.min(prev + coffeesPerLoad, filteredCoffees.length)
            );
        }
    };

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
            <div className="bg-[#f7edda] min-h-screen w-full flex flex-col pt-3">
                <div className="pb-3 flex flex-row justify-between px-10">
                    <h1 className="text-[#6F4E37] text-left text-4xl font-roboto-mono mt-2">
                        explore coffees
                    </h1>
                    <div>
                        <h3 className="hidden sm:block text-[#6F4E37] self-end pr-6">{session?.email}</h3>
                    </div>
                </div>

                {/* Search, sort and filter  */}
                <div className="px-5 pt-2">
                    <div className="mb-4 w-1/2">
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e)=>setSearchTerm(e.target.value)}
                            placeholder="Search"
                            className="w-full p-2 rounded-2xl bg-white border border-transparent focus:outline-none 
                            focus:ring-1 focus:ring-[#6F4E37] h-10"
                        />
                    </div>
                    <div className="w-1/4">
                        
                    </div>
                    <div className="w-1/4">
                    
                    </div>
                </div>

                <div className="w-full px-6 flex flex-row gap-3">
                    <div className="w-1/2 min-w-[300px] lg:h-900px">
                        <Map 
                            coffeeShops={coffeeShops} 
                            onMarkersReady={setMarkerMap}
                            isLoggedIn={isLoggedIn}
                            className={`w-full rounded-3xl mt-1.5 mb-2 
                                h-[650px] `}
                        />
                    </div>
                    <div className="w-1/2 h-[650px] grid grid-cols-1 lg:grid-cols-2 gap-5 
                        p-2 overflow-y-auto"
                        onScroll={handleScroll}
                    >
                    {visibleCoffees.length > 0 ? (
                        visibleCoffees.map((coffee) => (
                            <IcedCoffeeCard
                                onHover={() => handleMouseEnter(coffee.coffeeShop.id)}
                                onLeave={() => handleMouseLeave(coffee.coffeeShop.id)}
                                key={coffee.id}
                                {...coffee}
                            />
                        ))
                    ) : (
                        <p className="text-center col-span-full">No results found</p> // Optional: message when no results
                    )}
                    </div>
                    {/* <div className="w-1/2 space-y-4">
                        {coffeeShops?.map((coffeeShop)=>(
                            <CoffeeShopCard
                                key={coffeeShop.id}
                                coffeeShop={coffeeShop}
                            />
                        ))}
                    </div> */}
                </div>
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

// Coffee reviews with user info, display:
//     - Coffee name, price, description, rating, image
//     - The user who reviewed it
//     - Datetime of review

// Extras: dark mode? Skeleton loader? 


