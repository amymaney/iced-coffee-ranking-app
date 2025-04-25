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
    image: string;
    coffeeShop: {
      name: string;
    };
};

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
          <h1 className="text-2xl font-bold mb-4 text-center text-[#6F4E37] mt-8 font-roboto-mono">☕ my iced coffees</h1>
          {coffees.length === 0 ? (
            <p className="text-[#6F4E37] text-center">You haven't added any iced coffees yet.</p>
          ) : (
            <div className="grid gap-1 w-full max-w-4xl px-4">
              {coffees.map((coffee)=>(
                <div key={coffee.id} className="bg-[#FFFCF4] flex flex-row justify-between w-full mx-auto p-5 shadow-md mt-2 rounded-4xl mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-[#6F4E37]">{coffee.name}</h2>
                    <p className="text-sm text-gray-600">
                      {coffee.coffeeShop.name} — £{coffee.price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm">Rating: {coffee.rating}/5</p>
                    <p className="mt-2 text-sm text-gray-700">{coffee.description}</p>
                  </div>
                  <div>
                    {coffee.image!=="" && (
                      <img
                        src={coffee.image}
                        alt="uploaded image"
                        className="w-auto h-36 object-contain rounded-md shadow"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
}