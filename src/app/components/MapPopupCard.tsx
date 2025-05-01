import React from "react";
import type { CoffeeShop } from "../types";

interface MapPopupCardProps {
    shop: CoffeeShop;
}

export default function MapPopupCard({shop}:MapPopupCardProps){
    return(
        <div className="max-w-[200px] p-3 space-y-1">
            <h3 className="text-base font-semibold">{shop.name}</h3>
            <p className="text-sm text-gray-700">{shop.location}</p>
            <p className="text-sm text-yellow-600">⭐ {shop.rating.toFixed(2)}</p>
        </div>
    )
}