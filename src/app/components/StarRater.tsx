"use client";
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
    onRatingChange?: (rating: number) => void;
    name: string;
    value: number;
}

export default function StarRating({ name, value, onRatingChange }: StarRatingProps){
    const [rating, setRating] = useState<number>(0);

    const handleRating = (star: number) => {
        setRating(star);
        if(onRatingChange) onRatingChange(star);
    }

    return(
        <div className="flex space-x-4 justify-center items-center">
            {[1,2,3,4,5].map((star)=>(
                <Star
                    key={star}
                    type="button"
                    name={name}
                    className={`w-12 h-12 cursor-pointer ${
                        star <= value ? "text-yellow-500 fill-yellow-500":"text-[#a98467]"
                    }`}
                    strokeWidth={0.75}
                    onClick={()=>handleRating(star)}
                />
            ))}
            <input type="hidden" name={name} value={value} />
        </div>
    )
}