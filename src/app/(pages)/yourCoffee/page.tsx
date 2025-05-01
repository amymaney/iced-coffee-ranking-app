'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";
import IcedCoffeeCard from "@/app/components/IcedCoffeeCard";
import type {Coffee} from "../../types";

export default function YourCoffees(){
    const { data: session, status } = useSession();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!session;
    const [visibleCount, setVisibleCount] = useState(10);
    const coffeesPerLoad = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCoffees = coffees.filter(coffee=>coffee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const visibleCoffees = filteredCoffees.slice(0, visibleCount);

    useEffect(() => {
      const fetchCoffees = async () => {
        const res = await fetch("/api/coffees");
        if (res.ok) {
          const data = await res.json();
          setCoffees(data);
        }
        setLoading(false);
      };
    
      fetchCoffees();
    }, []);

    // Prevents unneccessary calls when all items are loaded
    useEffect(() => {
      if (visibleCount >= filteredCoffees.length) return;
    }, [visibleCount, filteredCoffees.length]);

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

    if (!session) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-[#6F4E37]">Please log in to view your coffees.</h2>
        </div>
      );
    }

    return(
      <div>
        <Header isLoggedIn={isLoggedIn} activePage="your-coffees" />
        <div className="bg-[#f7edda] min-h-screen w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#6F4E37] mt-6 font-roboto-mono">☕ my iced coffees</h1>
          {coffees.length === 0 ? (
            <p className="text-[#6F4E37] text-center">You haven't added any iced coffees yet.</p>
          ) : (
            <div 
              onScroll={handleScroll}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 
                overflow-y-auto h-[650px] p-2 w-[90%]">
              {visibleCoffees.length > 0 ? (
                visibleCoffees.map((coffee)=>(
                  <IcedCoffeeCard key={coffee.id} {...coffee} layout="image-side"/>
                ))
              ) : (
                <p className="text-center col-span-full">No results found</p> 
              )}
            </div>
          )}
        </div>
      </div>
    )
}