"use client";
import { useState, useEffect, useRef } from "react";
import StarRating from "../../components/StarRating";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";

type CoffeeFormState = {
  name: string;
  price: string;
  rating: number;
  coffeeShopId: string;
  description: string;
  image: string;
  location: string;
  coffeeShopName: string;
  lat: number;
  lng: number;
};


export default function NewIcedCoffee(){
  const [movingNext, setMovingNext] = useState<boolean>(false);
  const router = useRouter();  
    const { data: session, status } = useSession();
    useEffect(() => {
      if (status === "loading") return; 

      if (!session) {
        router.push("/"); 
      }
    }, [session, status, router]);

    const [coffee, setCoffee] = useState<CoffeeFormState>({
      name: "",
      price: "",
      rating: 0,
      coffeeShopId: "",
      description: "",
      image: "",
      location:"",
      coffeeShopName:"",
      lat:0,
      lng:0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [places, setPlaces] = useState<{name: string; place_id: string; formattedAddress: string}[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [outcomeMsg, setOutcomeMsg] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const handleSearch = async (query: string) => {
      setSearchQuery(query);
      if(query.length<3) return;
      setShowDropdown(true);

      // searches google places
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
                    // Centers on London
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

    const handlePlaceSelect = async (place: any) => {
      setCoffee((prev) => ({
        ...prev,
        coffeeShopId: place.place_id,
        location: place.formattedAddress,
        coffeeShopName: place.name
      }));
      setSearchQuery(place.name);
      setShowDropdown(false);
    
      // Fetch latitude and longitude of selected place
      try {
        const response = await fetch(`/api/places?place_id=${place.place_id}`);
        const data = await response.json();
    
        if (response.ok && data.lat && data.lng) {
          setCoffee((prev) => ({
            ...prev,
            lat: data.lat,
            lng: data.lng,
          }));
        } else {
          console.error("Error fetching latitude and longitude:", data.error);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file){
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };

    const handleSubmit = async (e: React.FormEvent)=> {
      setMovingNext(true);
      e.preventDefault();
      let uploadedImageUrl = "";

      let imageUploadStatus;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
    
        try {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
    
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
          imageUploadStatus=true;
        } catch (error) {
          console.error("Image upload failed", error);
          setOutcomeMsg("Image upload failed");
          imageUploadStatus=false;
          return; 
        }
      }

      if((imageUploadStatus && imageFile)||!imageFile){
        const coffeeData = {
          ...coffee,
          image: uploadedImageUrl,
        };

        try{
          const response = await fetch('/api/coffees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(coffeeData),
          });

          const data = await response.json();
          if(response.ok){
            console.log("Coffee added successfully", data);

            setCoffee({
              name:"",
              price:"",
              rating:0,
              coffeeShopId:"",
              description:"",
              image:"",
              location:"",
              coffeeShopName:"",
              lat:0,
              lng:0
            });

            setPlaces([]);
            setSearchQuery("");
            setImagePreview(null);
            setImageFile(null);
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

        router.push("/");
      }
    };

    return(
      <>
        <Header isLoggedIn={true} activePage="log-new" />
        <div className="bg-[#f7edda] min-h-screen flex flex-col items-center">

          <h3 className="hidden sm:block text-[#6F4E37] self-end pr-6 pt-3">{session?.email}</h3>

          <div className="lg:w-full max-w-lg mx-auto p-8 bg-[#fffcf4] shadow-md mt-5 lg:mt-0 mb-10 rounded-3xl">
            
            <h1 className="text-2xl text-[#6F4E37] font-roboto-mono font-bold mb-4 text-center">new iced coffee</h1>

            {/* new coffee form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-md font-medium font-semibold text-[#6F4E37] mb-2">coffee name ☕</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 rounded-xl bg-white placeholder:text-sm border-1 border-[#6F4E37]"
                  placeholder="iced pistachio latte"
                  value={coffee.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#6F4E37] mb-2">shop name</label>
                <input
                  type="text"
                  name="shop"
                  className="w-full p-2 bg-white rounded-xl placeholder:text-sm border-1 border-[#6F4E37]"
                  placeholder="the big bean"
                  value={searchQuery}
                  onChange={(e)=>handleSearch(e.target.value)}
                  required
                />
                {(showDropdown&&searchQuery.length!==0 )&&(
                  <ul className="bg-white rounded-xl mt-2 max-h-60 overflow-y-auto custom-scrollbar border-1 border-[#6F4E37]">
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
                <label className="block text-md font-medium font-semibold text-[#6F4E37] mb-2">price</label>
                <input
                  type="text"
                  name="price"
                  className="w-full p-2 bg-white rounded-xl placeholder:text-sm border-1 border-[#6F4E37]"
                  placeholder="4.99"
                  value={coffee.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#6F4E37] mb-2">rating</label>
                <StarRating
                  name="star-rating"
                  value={coffee.rating}
                  onRatingChange={handleRatingChange}
                />
          
              </div>
              <div>
                <label className="block text-md font-medium font-semibold text-[#6F4E37] mb-2">review</label>
                <textarea
                  name="description"
                  className="w-full p-2 bg-white rounded-xl placeholder:text-sm border-1 border-[#6F4E37]"
                  placeholder="your thoughts on this iced coffee..."
                  value={coffee.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-md font-medium font-semibold text-[#6F4E37] mb-2">upload a photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-[#966d50]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-1 file:border-[#6F4E37]
                    file:text-sm file:font-semibold
                    file:bg-[#f7edda] file:text-[#4C3730]
                    hover:file:shadow-md cursor-pointer"
                />
              </div>

              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="mt-4 rounded-xl max-w-full h-[400px] lg:h-auto mx-auto"
                />
              )}

              {outcomeMsg!==""&&(
                <p className=" mb-3 font-semibold text-[#656d4a] text-center">
                  {outcomeMsg}
                </p>
              )}
              <button type="submit" className="bg-[#DAE4F7] text-[#432818] px-4 py-2 font-semibold rounded-xl w-full cursor-pointer 
                transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-1 border-[#6F4E37]"
              >
                {movingNext ? "loading..." : "submit"}
              </button>
            </form>

          </div>
        </div>
      </>
    
    )
}