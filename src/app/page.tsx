"use client";

import React, { useEffect, useState } from "react";
import CoffeeShopCoffeeOnly from "./components/CoffeeShopOnly";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { LogOut } from "lucide-react";
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Map = dynamic(()=> import('./components/Map'), {ssr: false})

const Page: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log('session',session);

  // If there's no session (i.e., the user is not logged in)
  const isLoggedIn = !!session;
  const [loading, setLoading] = useState(true);
  const [coffeeShops, setCoffeeShops] = useState<any[]>([]);

  useEffect(()=>{
    const fetchCoffeeShops = async () => {
      try{
        const response = await fetch("/api/coffee-shops?limit=4");
        if(!response.ok) throw new Error("Failed to fetch coffee shops");

        const data = await response.json();
        console.log('data', data);
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
          <h3 className="cursor-pointer py-2 px-3 ">Explore</h3>
          {isLoggedIn&&(
            <>
              <h3 className="cursor-pointer py-2 px-3 ">Your coffees</h3>
              <h3 onClick={() => router.push("/pages/newCoffee")} className="cursor-pointer py-2 px-3 ">Log new</h3>
            </>
          )}
          {!isLoggedIn&&(
            <>
              <div className="w-65"></div>
            </>
          )}
        </div>
        <div className="px-6 py-4">
          {isLoggedIn&&(
            <h3 onClick={() => signOut()} className="cursor-pointer text-[#4c3730]">
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
                <CoffeeShopCoffeeOnly key={coffeeShop.id} coffeeShop={coffeeShop} />
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
            <Map coffeeShops={coffeeShops}/>
          </div>
        </div>
       
      </div>
    </div>
  )

  // return (
  //   <div className="min-h-screen bg-[#a98467] relative flex flex-col">
  //     {/* Display this section only if user is logged in */}
  //     {isLoggedIn && (
  //       <div className="flex justify-between items-center mt-4 ml-8 mr-10">
  //         <div className="text-lg font-bold pr-4 pt-0.25 text-[#f0ead2]">
  //           <h2>{session.user?.email}</h2>
  //         </div>

  //         <div
  //           className="flex flex-row text-[#f0ead2] cursor-pointer w"
  //           onClick={() => signOut()} // Log out the user
  //         >
  //           <h2 className="text-lg font-bold pr-4 pt-0.25">sign out</h2>
  //           <LogOut className="w-8 h-8" />
  //         </div>
  //       </div>
  //     )}

  //     {/* Main content area */}
  //     <div className="w-full max-w-xl mx-auto p-10 bg-[#f0ead2] shadow-md mt-10 rounded-xl flex flex-col items-center justify-center">
  //       <h1 id="page-title" className="text-4xl font-semibold text-center mb-3 text-[#432818]">
  //         the bean map
  //       </h1>

  //       <h2 className="mb-2">
  //         Find your next iced coffee fix across London.
  //       </h2>

  //       {/* Show 'Log a new iced coffee' button only if logged in */}
  //       {isLoggedIn && (
  //         <div>
  //           <button
  //             onClick={() => router.push("/pages/newCoffee")}
  //             className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-60 cursor-pointer block mx-auto mt-2"
  //           >
  //             log a new iced coffee
  //           </button>

  //           <button
  //             onClick={()=> router.push("/pages/yourCoffee")}
  //             className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-60 cursor-pointer block mx-auto mt-3"
  //           >
  //             view your coffees
  //           </button>
  //         </div>
  //       )}

  //       {/* Show 'Sign In' button if user is not logged in */}
  //       {!isLoggedIn && (
  //         <>
  //           <h2 className="text-[#582f0e] mb-1">
  //             sign in with
  //           </h2>
  //           <div className="flex">
  //             <button
  //               onClick={()=>signIn("google")}
  //               className="mr-5 bg-white text-[#432818] px-4 py-2 font-semibold rounded-xl w-35 cursor-pointer block mx-auto flex items-center justify-center"
  //             >
  //               <img
  //                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png"
  //                 alt="Google logo"
  //                 className="w-6 h-6 mr-3"
  //               />
  //               <h1>Google</h1>
  //             </button>
  //             <button
  //               onClick={()=>signIn("microsoft")}
  //               className="bg-white text-[#432818] px-4 py-2 font-semibold rounded-xl w-35 cursor-pointer block mx-auto flex items-center justify-center"
  //             >
  //               <img
  //                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
  //                 alt="Microsoft logo"
  //                 className="w-5 h-5 mr-3"
  //               />
  //               <h1>Microsoft</h1>
  //             </button>
  //           </div>
  //         </>
  //       )}
  //     </div>

  //     {/* Display coffee shop list */}
      // <div className="mb-20">
      //   {coffeeShops.map((coffeeShop) => (
      //     <CoffeeShopComponent key={coffeeShop.id} coffeeShop={coffeeShop} />
      //   ))}
      // </div>
  //   </div>
  // );
};

export default Page;
