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
        <div className="bg-[#f7edda] min-h-screen w-full flex flex-col items-center pb-10">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#6F4E37] mt-6 font-roboto-mono">☕ my iced coffees</h1>
          {coffees.length === 0 ? (
            <p className="text-[#6F4E37] text-center">You haven't added any iced coffees yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 mx-auto">
              {coffees.map((coffee) => (
                <IcedCoffeeCard key={coffee.id} {...coffee} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
}