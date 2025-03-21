"use client";
import { useState, useEffect } from "react";
import StarRating from "../../components/StarRater";
import { SquareArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function NewIcedCoffee(){
  const router = useRouter();
    const { data: session, status } = useSession();
    
    // If status is "loading", show a loading state
    if (status === "loading") {
      return <p>Loading...</p>;
    }
    
    useEffect(() => {
      if (!session) {
        router.push("/"); // Redirect to home after signing in
      }
    }, [session, router]);

    const [coffee, setCoffee] = useState({
        name:"",
        price:"",
        rating:0,
        shop:"",
        description:"",
        image:""
    });

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

    const handleSubmit = (e: React.FormEvent)=> {
        e.preventDefault();
        console.log("coffee",coffee);

        // Reset after submission
        setCoffee({
            name:"",
            shop:"",
            price:"",
            rating:0,
            description:"",
            image:""
        })
    }

    return(
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
      
        <div className="w-full max-w-lg mx-auto p-10 bg-[#f0ead2] shadow-md mt-10 rounded-xl">
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
                value={coffee.shop}
                onChange={handleChange}
                required
              />
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
                name="review"
                className="w-full p-2 bg-white rounded-xl placeholder:text-sm"
                placeholder="your thoughts on this iced coffee..."
                value={coffee.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-full cursor-pointer">
              submit
            </button>
          </form>
        </div>
        
      </div>
      
    )
}