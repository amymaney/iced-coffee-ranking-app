'use client';
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, SquareArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Coffee = {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string;
    coffeeShop: {
      name: string;
    };
};

export default function YourCoffees(){
    const router = useRouter();
    const { data: session, status } = useSession();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoffees = async () => {
          const res = await fetch("/api/user-coffees");
          if (res.ok) {
            const data = await res.json();
            setCoffees(data);
          }
          setLoading(false);
        };
    
        fetchCoffees();
    }, []);
    
    if (status === "loading" || loading) {
    return <div className="p-6 text-center text-white">Loading...</div>;
    }

    if (!session) {
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-white">Please log in to view your coffees.</h2>
          </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#a98467] relative flex flex-col">
          <div className="flex justify-between items-center mt-4 ml-8 mr-10">
            <div className="text-lg font-bold pr-4 pt-0.25 text-[#f0ead2]">
              <SquareArrowLeft
                onClick={() => router.push("/")}
                className="cursor-pointer w-8 h-8 text-[#f0ead2] mt-2"
              />
            </div>
    
            <div
              className="flex flex-row text-[#f0ead2] cursor-pointer"
              onClick={() => signOut()}
            >
              <h2 className="text-lg font-bold pr-4 pt-0.25">sign out</h2>
              <LogOut className="w-8 h-8" />
            </div>
          </div>
    
          <h1 className="text-2xl font-bold mb-4 text-center text-white mt-2">☕ my iced coffees</h1>
    
          {coffees.length === 0 ? (
            <p className="text-white text-center">You haven't added any iced coffees yet.</p>
          ) : (
            <div className="grid gap-1">
              {coffees.map((coffee) => (
                <div key={coffee.id} className="max-w-md w-[90%] sm:w-[80%] md:max-w-2xl mx-auto p-5 bg-[#f0ead2] shadow-md mt-2 rounded-lg mb-2">
                  <h2 className="text-lg font-semibold">{coffee.name}</h2>
                  <p className="text-sm text-gray-600">
                    {coffee.coffeeShop.name} — £{coffee.price.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm">Rating: {coffee.rating}/5</p>
                  <p className="mt-2 text-sm text-gray-700">{coffee.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
}