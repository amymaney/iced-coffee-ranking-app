"use client";
import { useState, useEffect } from "react";
import StarRating from "../components/StarRater";
import { SquareArrowLeft } from "lucide-react";

export default function NewIcedCoffee(){

    const [coffee, setCoffee] = useState({
        name:"",
        price:"",
        rating:0,
        shop:"",
        description:"",
        image:""
    });

    const handleBack = () => {
      window.location.href="/" // Navigate to the homepage
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
        <div className="absolute top-6 left-6 z-10">
          <SquareArrowLeft 
            onClick={handleBack}
            className="cursor-pointer w-8 h-8 text-[#f0ead2]" 
          />
        </div>

        <div className="w-full max-w-lg mx-auto p-10 bg-[#f0ead2] shadow-md mt-30 rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#432818]">new iced coffee</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-md font-medium font-semibold text-[#432818] mb-2">coffee name ☕</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 rounded-lg bg-white placeholder:text-sm"
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
                className="w-full p-2 bg-white rounded-lg placeholder:text-sm"
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
                className="w-full p-2 bg-white rounded-lg placeholder:text-sm"
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
                className="w-full p-2 bg-white rounded-lg placeholder:text-sm"
                placeholder="your thoughts on this iced coffee..."
                value={coffee.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded w-full">
              submit
            </button>
          </form>
        </div>
        
      </div>
      
    )
}