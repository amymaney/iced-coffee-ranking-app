"use client";

import React, { useEffect, useState } from "react";
import CoffeeShopComponent from "./components/CoffeeShop";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { LogOut } from "lucide-react";

const Page: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If there's no session (i.e., the user is not logged in)
  const isLoggedIn = !!session;
  const [loading, setLoading] = useState(true);
  const [coffeeShops, setCoffeeShops] = useState<any[]>([]);

  useEffect(()=>{
    const fetchCoffeeShops = async () => {
      try{
        const response = await fetch("/api/coffee-shops");
        if(!response.ok) throw new Error("Failed to fetch coffee shops");

        const data = await response.json();
        setCoffeeShops(data);
      }
      catch(error){
        console.error("Error loading coffee shops:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchCoffeeShops();
  },[]);

  return (
    <div className="min-h-screen bg-[#a98467] relative flex flex-col">
      {/* Display this section only if user is logged in */}
      {isLoggedIn && (
        <div className="flex justify-between items-center mt-4 ml-8 mr-10">
          <div className="text-lg font-bold pr-4 pt-0.25 text-[#f0ead2]">
            <h2>{session.user?.email}</h2>
          </div>

          <div
            className="flex flex-row text-[#f0ead2] cursor-pointer w"
            onClick={() => signOut()} // Log out the user
          >
            <h2 className="text-lg font-bold pr-4 pt-0.25">sign out</h2>
            <LogOut className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="w-full max-w-xl mx-auto p-10 bg-[#f0ead2] shadow-md mt-10 rounded-xl flex flex-col items-center justify-center">
        <h1 id="page-title" className="text-4xl font-semibold text-center mb-3 text-[#432818]">
          london iced coffees
        </h1>
        <h2 className="text-[#582f0e] mb-5">
          sign in with
        </h2>

        {/* Show 'Log a new iced coffee' button only if logged in */}
        {isLoggedIn && (
          <button
            onClick={() => router.push("/pages/newCoffee")}
            className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-60 cursor-pointer block mx-auto"
          >
            log a new iced coffee
          </button>
        )}

        {/* Show 'Sign In' button if user is not logged in */}
        {!isLoggedIn && (
          <div className="flex">
            <button
              onClick={()=>signIn("google")}
              className="mr-5 bg-white text-[#432818] px-4 py-2 font-semibold rounded-xl w-35 cursor-pointer block mx-auto flex items-center justify-center"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png"
                alt="Google logo"
                className="w-6 h-6 mr-3"
              />
              <h1>Google</h1>
            </button>
            <button
              onClick={()=>signIn("google")}
              className="bg-white text-[#432818] px-4 py-2 font-semibold rounded-xl w-35 cursor-pointer block mx-auto flex items-center justify-center"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
                alt="Microsoft logo"
                className="w-5 h-5 mr-3"
              />
              <h1>Microsoft</h1>
            </button>
          </div>
        )}
      </div>

      {/* Display coffee shop list */}
      <div className="mb-20">
        {coffeeShops.map((coffeeShop) => (
          <CoffeeShopComponent key={coffeeShop.id} coffeeShop={coffeeShop} />
        ))}
      </div>
    </div>
  );
};

export default Page;
