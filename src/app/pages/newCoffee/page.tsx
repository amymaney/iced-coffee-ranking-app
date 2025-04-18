"use client";
import { useState, useEffect, useRef } from "react";
import StarRating from "../../components/StarRater";
import { SquareArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Head from "next/head";

interface CoffeeData {
  name: string;
  price: number;
  rating: number;
  coffeeShopId: string;
  description: string;
  image: string;
  location: string;
  coffeeShopName: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function NewIcedCoffee(){
  const router = useRouter();
    const { data: session, status } = useSession();
    
    useEffect(() => {
      if (!session) {
        router.push("/"); // Redirect to home after signing in
      }
    }, [session, router]);

    const [coffee, setCoffee] = useState<CoffeeData>({
      name: "",
      price: 0,
      rating: 0,
      coffeeShopId: "",
      description: "",
      image: "",
      location:"",
      coffeeShopName:""
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [places, setPlaces] = useState<{name: string; place_id: string}[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [outcomeMsg, setOutcomeMsg] = useState<string>("");
    
    const handleSearch = async (query: string) => {
      setSearchQuery(query);
      if(query.length<3) return;
      setShowDropdown(true);

      try{
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type":"application/json",
              "X-Goog-Api-Key":process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
              "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id",
            },
            body: JSON.stringify({
              textQuery: `${query} coffee, restaurant`,
              locationBias: {
                circle: {
                  center: {
                    // Restrict to London
                    latitude: 51.5074,
                    longitude: -0.1278,
                  },
                  radius: 30000,//30km radius around London
                }
              }
            })
          }
        );

        const data = await response.json();
        if(data.places) {
          setPlaces(
            data.places.map((place: any) => ({
              name: place.displayName.text, 
              place_id: place.id, 
              formattedAddress: place.formattedAddress,
            }))
          );
        }
      } catch(error){
        console.error("Error fetching places:", error);
      }
    };

    const handlePlaceSelect = (place:any) => {
      setCoffee((prev)=>({
        ...prev,
        coffeeShopId: place.place_id,
        location: place.formattedAddress,
        coffeeShopName: place.name
    }));
      setSearchQuery(place.name);
      setShowDropdown(false);
    };

    const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCoffee((prev)=>({
            ...prev,
            [name]: value,
        }));
    };

    const handleRatingChange = (newRating:number)=>{
      setCoffee((prev)=>({
        ...prev,
        rating: newRating,
      }));
    };

    const handleSubmit = async (e: React.FormEvent)=> {
      e.preventDefault();
      console.log("coffee",coffee);

      try{
        const response = await fetch('/api/iced-coffees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(coffee),
        });

        const data = await response.json();
        if(response.ok){
          console.log("Coffee added successfully", data);

          setCoffee({
            name:"",
            price:0,
            rating:0,
            coffeeShopId:"",
            description:"",
            image:"",
            location:"",
            coffeeShopName:""
          });

          setPlaces([]);
          setSearchQuery("");

        }
        else{
          console.error("Error adding coffee:", data);
          setOutcomeMsg("Error occurred please try again");
        setTimeout(() => {
          setOutcomeMsg(""); 
        }, 4000);
        }
      } 
      catch(error){
        console.error("Error submitting coffee:", error);
        setOutcomeMsg("Error occurred please try again");
        setTimeout(() => {
          setOutcomeMsg(""); 
        }, 4000);
      }

      setOutcomeMsg("Coffee successfully submitted");
      setTimeout(() => {
        setOutcomeMsg(""); 
      }, 4000);
    };

    return(
      <>
         <Head>
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC2639TXrML796Unlkddbr78sas1uKRYpA&libraries=places`}
            async
          ></script>
        </Head>
        <div className="min-h-screen bg-[#a98467] relative flex flex-col">
          <div className="flex justify-between items-center mt-4 ml-8 mr-10">
            <div className="text-lg font-bold pr-4 pt-0.25 text-[#f0ead2]">
              <SquareArrowLeft 
                onClick={() => router.push("/")}
                className="cursor-pointer w-8 h-8 text-[#f0ead2] mt-2" 
              />
            </div>

            <div
              className="flex flex-row text-[#f0ead2] cursor-pointer w"
              onClick={() => signOut()} // Log out the user
            >
              <h2 className="text-lg font-bold pr-4 pt-0.25">sign out</h2>
              <LogOut className="w-8 h-8" />
            </div>
          </div>
        
          <div className="w-full max-w-lg mx-auto p-10 bg-[#f0ead2] shadow-md mt-10 mb-20 rounded-xl">
            <h1 className="text-2xl font-bold mb-4 text-center text-[#432818]">new iced coffee</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-md font-medium font-semibold text-[#432818] mb-2">coffee name ☕</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 rounded-xl bg-white placeholder:text-sm"
                  placeholder="iced pistachio latte"
                  value={coffee.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#432818] mb-2">shop name</label>
                <input
                  type="text"
                  name="shop"
                  className="w-full p-2 bg-white rounded-xl placeholder:text-sm"
                  placeholder="the big bean"
                  value={searchQuery}
                  onChange={(e)=>handleSearch(e.target.value)}
                  required
                />
                {(showDropdown&&searchQuery.length!==0 )&&(
                  <ul className="bg-white rounded-xl mt-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {places.map((place)=>(
                      <li
                        key={`${place.place_id}-${place.name}`}
                        className="p-2 hover:bg-[#dde5b6] cursor-pointer rounded-xl"
                        onClick={()=>handlePlaceSelect(place)}
                      >
                        <div>{place.name}</div>
                        <div className="text-sm text-gray-600">{place?.formattedAddress}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#432818] mb-2">price</label>
                <input
                  type="text"
                  name="price"
                  className="w-full p-2 bg-white rounded-xl placeholder:text-sm"
                  placeholder="4.99"
                  value={coffee.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#432818] mb-2">rating</label>
                <StarRating
                  name="star-rating"
                  value={coffee.rating}
                  onRatingChange={handleRatingChange}
                />
          
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#432818] mb-2">review</label>
                <textarea
                  name="description"
                  className="w-full p-2 bg-white rounded-xl placeholder:text-sm"
                  placeholder="your thoughts on this iced coffee..."
                  value={coffee.description}
                  onChange={handleChange}
                />
              </div>
              {outcomeMsg!==""&&(
                <p className=" mb-3 font-semibold text-[#656d4a] text-center">
                  {outcomeMsg}
                </p>
              )}
              <button type="submit" className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-full cursor-pointer">
                submit
              </button>
            </form>
          </div>
        </div>
      </>
    
    )
}