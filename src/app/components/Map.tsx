"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";

interface CoffeeShop {
  id: number;
  name: string;
  rating: number;
  location: string;
  icedCoffees: {
    id: number;
    name: string;
    price: number;
    rating: number;
    description: string;
    image: string;
  }[];
  lat: number;
  lng: number;
  _count: {
    icedCoffees: number;
  };
}

export type MarkerMap = Record<number, google.maps.marker.AdvancedMarkerElement>;

interface MapProps {
  coffeeShops: CoffeeShop[];
  onMarkersReady?: (markerMap: MarkerMap) => void;
  isLoggedIn: boolean;
}

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

interface MapProps {
  coffeeShops: CoffeeShop[];
  highlightedCoffee?: Coffee;
  onMarkersReady?: (markerMap: MarkerMap) => void;
}

const Map = forwardRef(function Map({ coffeeShops, highlightedCoffee, onMarkersReady, isLoggedIn }: MapProps, ref) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window === "undefined") return;

      if (!window.google) {
        const existingScript = document.querySelector(
          'script[src^="https://maps.googleapis.com/maps/api/js"]'
        );

        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
          script.async = true;
          script.defer = true;
          script.onload = () => setMapLoaded(true);
          script.setAttribute("data-loaded", "true");
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener("load", () => setMapLoaded(true));
        }
      } else {
        setMapLoaded(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  // Create map and markers
  useEffect(() => {
    if (!mapLoaded || !window.google || !mapRef.current) return;

    // calculates average of all coffee shop lat and longs to find center
    const latSum = coffeeShops.reduce((sum, shop) => sum + shop.lat, 0);
    const lngSum = coffeeShops.reduce((sum, shop) => sum + shop.lng, 0);

    const avgLat = latSum / coffeeShops.length;
    const avgLng = lngSum / coffeeShops.length;

    const center = { lat: avgLat, lng: avgLng };

    const map = new google.maps.Map(mapRef.current, {
      center: center,
      zoom: 12,
      mapId: "23d1afba9d0a35d",
    });

    // stores all map markers by coffee shop id
    const markerMap: MarkerMap = {};
    const markerLib = (google.maps as any).marker;
    if (!markerLib?.AdvancedMarkerElement) return;

    // loops through each coffee shop and creates coffee bean marker
    coffeeShops.forEach((shop) => {
      if (typeof shop.lat === "number" && typeof shop.lng === "number") {
        const markerDiv = document.createElement("div");
        const img = document.createElement("img");
        img.src = "/coffee-bean.png";
        img.style.width = "25px";
        img.style.height = "25px";

        markerDiv.appendChild(img);

        const marker = new markerLib.AdvancedMarkerElement({
          map,
          position: { lat: shop.lat, lng: shop.lng },
          title: shop.name,
          content: markerDiv,
        });

        markerMap[shop.id] = marker;
      }
    });

    onMarkersReady?.(markerMap);

    // Add star marker (5 star coffee)
    if (highlightedCoffee?.coffeeShop?.lat && highlightedCoffee?.coffeeShop?.lng) {
      const emojiDiv = document.createElement("div");
      emojiDiv.textContent = "⭐";
      emojiDiv.style.fontSize = "30px"; 
      emojiDiv.style.transform = "translate(-50%, -50%)"; 
      emojiDiv.style.position = "relative";
    
      const spotlightMarker = new markerLib.AdvancedMarkerElement({
        map,
        position: {
          lat: highlightedCoffee.coffeeShop.lat,
          lng: highlightedCoffee.coffeeShop.lng,
        },
        title: `⭐ ${highlightedCoffee.name}`,
        content: emojiDiv,
      });
    }
    
  }, [coffeeShops, mapLoaded, onMarkersReady]);


  return (
    <div
      ref={mapRef}
      className={`w-full rounded-3xl mt-1.5 mb-4 
        ${isLoggedIn ? 'h-[412px]' : 'h-[510px]'} 
      `}      
    />
  );
});

export default Map;
