"use client";

import React, { useEffect, useState } from "react";
import CoffeeShopCoffeeOnly from "./components/CoffeeShopOnly";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { MarkerMap } from "./components/Map";

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
};

const Map = dynamic(()=> import('./components/Map'), {ssr: false})

const Page: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [markerMap, setMarkerMap] = useState<{ [id: number]: google.maps.marker.AdvancedMarkerElement }>({});

  // If there's no session (i.e., the user is not logged in)
  const isLoggedIn = !!session;
  const [loading, setLoading] = useState(true);
  const [coffeeShops, setCoffeeShops] = useState<any[]>([]);
  const [fiveStarCoffee, setFiveStarCoffee] = useState<Coffee>();

  useEffect(()=>{
    const fetchCoffeeShops = async () => {
      try{
        const response = await fetch("/api/coffee-shops?limit=4");
        if(!response.ok) throw new Error("Failed to fetch coffee shops");

        const data = await response.json();
        console.log('coffee shops', data);
        setCoffeeShops(data);
      }
      catch(error){
        console.error("Error loading coffee shops:", error);
      }
    };

    const fetchFiveStarCoffee = async () => {
      try{
        const response = await fetch("/api/coffees?rating=5&noUser=true&limit=1");
        if(!response.ok) throw new Error("Failed to fetch coffee");

        const data = await response.json();
        console.log("coffees", data);
        setFiveStarCoffee(data[0]);
      }
      catch(error){
        console.log("Error loading coffee", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchCoffeeShops();
    fetchFiveStarCoffee();

  },[]);

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
  

  if (loading) {
    // You can add a loading spinner, skeleton, or just a blank screen until the page is ready
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffcf4]">
        <div className="loader">Loading...</div> {/* Add your loader component or text */}
      </div>
    );
  }

  return(
    <div>
      <div className="flex justify-between bg-[#fffcf4] h-15">
        <div className="flex items-center justify-between px-6 py-4 text-[#4c3730] w-2/3 pr-20">
          <img 
            alt="coffee bean"
            src="/coffee-bean.png"
            className="h-8 w-8"
          />
          <div className="">
            <h3 
              className="bg-[#f7edda] py-2 px-3 rounded-2xl cursor-pointer"
            >
              Home
            </h3>
          </div>
          <h3 className="cursor-pointer py-2 px-3 hover:bg-[#f7edda] hover:rounded-2xl">Explore</h3>
          {isLoggedIn&&(
            <>
              <h3 className="cursor-pointer py-2 px-3 hover:bg-[#f7edda] hover:rounded-2xl">Your coffees</h3>
              <h3 onClick={() => router.push("/pages/newCoffee")} className="cursor-pointer py-2 px-3 hover:bg-[#f7edda] hover:rounded-2xl">Log new</h3>
            </>
          )}
          {!isLoggedIn&&(
            <>
              <div className="w-65"></div>
            </>
          )}
        </div>
        <div className="px-6 py-3 items-center">
          {isLoggedIn&&(
            <h3 onClick={() => signOut()} className="cursor-pointer text-[#4c3730] py-2 px-3 hover:bg-[#f7edda] hover:rounded-2xl">
              Sign out
            </h3>
          )}
          {!isLoggedIn &&(
            <h3 className="text-[#4c3730]">
              You are not signed in
            </h3>
          )}
        </div>
      </div>
      <div className="bg-[#f7edda] min-h-screen flex flex-col items-center pt-6">
        <div className="mb-8">
          <h1 className="text-[#6F4E37] text-center text-5xl font-roboto-mono pb-3">the bean map</h1>
          <h2 className="text-[#6F4E37] text-xl">for londoners who like their coffee on the rocks.</h2>
        </div>
        <div className="flex justify-between w-full px-20 gap-x-8">
          <div className="w-3/5">
            <h3 className="text-[#6F4E37] text-xl text-left">top coffee shops</h3>
            <div className="space-y-6 mt-4 mb-10">
              {coffeeShops.map((coffeeShop) => (
                <CoffeeShopCoffeeOnly 
                  key={coffeeShop.id} 
                  coffeeShop={coffeeShop} 
                  onHover={() => handleMouseEnter(coffeeShop.id)}
                  onLeave={() => handleMouseLeave(coffeeShop.id)}
                />
              ))}
            </div>
          </div>
          <div className="w-2/5 px-2 py-2 space-y-4">
            {!isLoggedIn&&(
              <>
                <button 
                  onClick={()=>signIn("google")}
                  className="bg-[#FFFCF4] w-full px-3 py-3 rounded-3xl cursor-pointer text-center flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png"
                    alt="Google logo"
                    className="w-7 h-7 mr-5"
                  />
                  <h3 className="text-[#4C3730] text-xl">Sign in with Google</h3>
                </button>
                <button 
                  onClick={()=>signIn("microsoft")}
                  className="bg-[#FFFCF4] w-full px-3 py-3 rounded-3xl cursor-pointer text-center flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
                    alt="Google logo"
                    className="w-6 h-6 mr-5"
                  />
                  <h3 className="text-[#4C3730] text-xl">Sign in with Microsoft</h3>
                </button>
              </>
            )}
            {isLoggedIn&&(
              <>  
                <h3 className="text-[#6F4E37] text-xl text-left">5⭐ coffee spotlight</h3>
                <div className="w-full bg-[#FFFCF4] px-6 py-5 rounded-3xl mb-5 flex justify-between">
                  <div className="">
                    <h2 className="text-[#6F4E37] text-xl font-extrabold">{fiveStarCoffee?.name}</h2>
                    <h3 className="text-[#6F4E37] text-lg">{fiveStarCoffee?.coffeeShop?.name} - £{fiveStarCoffee?.price}</h3>
                  </div>
                  <div className=" text-right">
                    <h2 className="text-md" style={{ color: "rgba(111, 78, 55, 0.75)" }}>{fiveStarCoffee?.description}</h2>
                  </div>
                </div>
              </>
            )}
            <Map 
              coffeeShops={coffeeShops} 
              onMarkersReady={setMarkerMap} 
              highlightedCoffee={fiveStarCoffee}
            />

          </div>
        </div>
       
      </div>
    </div>
  )

};

export default Page;
