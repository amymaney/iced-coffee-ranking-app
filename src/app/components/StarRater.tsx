"use client";
import { Star } from "lucide-react";

interface StarRatingProps {
    onRatingChange?: (rating: number) => void;
    name: string;
    value: number;
}

// Star rating component
export default function StarRating({ name, value, onRatingChange }: StarRatingProps){

    const handleRating = (star: number) => {
        if(onRatingChange) onRatingChange(star);
    }

    return(
        <div className="flex space-x-4 justify-center items-center">
            {[1,2,3,4,5].map((star)=>(
                <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className="p-0 m-0 bg-transparent border-none cursor-pointer"
                >
                    <Star
                        className={`w-12 h-12 ${
                            star <= value ? "text-[#EFBB2C] fill-[#EFBB2C]" : "text-[#a98467]"
                        }`}
                        strokeWidth={0.75}
                    />
                </button>
            ))}
            <input type="hidden" name={name} value={value} />
        </div>
    )
}