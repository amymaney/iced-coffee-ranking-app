"use client";

import { useEffect, useRef, useState } from "react";

interface CoffeeShop {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

interface Props {
  coffeeShops: CoffeeShop[];
}

export default function Map({ coffeeShops }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window !== "undefined" && !window.google) {
        // Check if script is already in the DOM
        const existingScript = document.querySelector(
          'script[src^="https://maps.googleapis.com/maps/api/js"]'
        );
  
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
          script.async = true;
          script.defer = true;
          script.onload = () => setMapLoaded(true);
          document.head.appendChild(script);
        } else {
          // If script exists, wait for it to be loaded
          if (existingScript.getAttribute("data-loaded")) {
            setMapLoaded(true);
          } else {
            existingScript.addEventListener("load", () => setMapLoaded(true));
          }
        }
      } else if (window.google) {
        setMapLoaded(true);
      }
    };
  
    loadGoogleMapsScript();
  }, []);
  

  useEffect(() => {
    if (!mapLoaded || !window.google || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 51.509865, lng: -0.118092 }, // Default to central London
      zoom: 12,
      mapId:"23d1afba9d0a35d"
    });

    const infoWindow = new google.maps.InfoWindow(); 

    coffeeShops.forEach((shop) => {
      // Only add marker if lat/lng are valid numbers
      if (typeof shop.lat === "number" && typeof shop.lng === "number") {
        const markerDiv = document.createElement("div");

        const img = document.createElement("img");
        img.src ='/coffee-bean.png'; 
        img.style.width = "25px";  
        img.style.height = "25px";
      
        // Append the image to markerDiv
        markerDiv.appendChild(img);

        const { AdvancedMarkerElement } = (google.maps as any).marker;

        if (AdvancedMarkerElement) {
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: shop.lat, lng: shop.lng },
            title: shop.name,
            content: markerDiv,
          });
          
          // Show info window on click
          marker.addListener("click", () => {
            infoWindow.setContent(`
              <div style="padding: 8px;">
                <strong>${shop.name}</strong><br/>
                ${shop.location}
              </div>
            `);
            infoWindow.open(map, marker);
          });
        } else {
          console.warn("AdvancedMarkerElement is not available");
        }
            
      } else {
        console.warn(`Missing coordinates for ${shop.name}`);
      }
    });
  }, [coffeeShops, mapLoaded]);

  return <div ref={mapRef} className="w-full h-[450px] rounded-xl mt-4 mb-4" />;
}
