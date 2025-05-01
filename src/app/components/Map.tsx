"use client";

import { useEffect, useRef, useState, forwardRef,} from "react";
import { renderToString } from "react-dom/server";
import type { CoffeeShop, Coffee } from "../types";
import MapPopupCard from "./MapPopupCard";

export type MarkerMap = Record<number, google.maps.marker.AdvancedMarkerElement>;

interface MapProps {
  coffeeShops: CoffeeShop[];
  highlightedCoffee?: Coffee | null;
  onMarkersReady?: (markerMap: MarkerMap) => void;
  isLoggedIn: boolean;
  className: string;
}

const Map = forwardRef(function Map({ coffeeShops, highlightedCoffee, onMarkersReady, className }: MapProps, ref) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window === "undefined") return;

      // checks if Google Maps API is loaded yet
      if (!window.google) {
        const existingScript = document.querySelector(
          'script[src^="https://maps.googleapis.com/maps/api/js"]'
        );

        if (!existingScript) {
          // loads the google maps api script (with the places and marker libraries)
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
          script.async = true; 
          script.defer = true;
          script.onload = () => setMapLoaded(true);
          script.setAttribute("data-loaded", "true"); // keeps track script has been loaded
          document.head.appendChild(script); 
        } 
        else {
          // set map as loaded when script finishes loading
          existingScript.addEventListener("load", () => setMapLoaded(true));
        }
      } 
      else {
        setMapLoaded(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  // Create map and custom markers
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

    // accesses google maps marker library
    const markerLib = (google.maps as any).marker;
    if (!markerLib?.AdvancedMarkerElement) return;

    // loops through each coffee shop and creates coffee bean marker
    coffeeShops.forEach((shop) => {
      if (typeof shop.lat === "number" && typeof shop.lng === "number") {

        // Marker content
        const markerDiv = document.createElement("div");
        const img = document.createElement("img");
        img.src = "/coffee-bean.png";
        img.style.width = "25px";
        img.style.height = "25px";
        markerDiv.appendChild(img);

        // Creates and places marker
        const marker = new markerLib.AdvancedMarkerElement({
          map,
          position: { 
            lat: shop.lat, 
            lng: shop.lng 
          },
          title: shop.name,
          content: markerDiv,
        });

        markerMap[shop.id] = marker;

        // creates pop up card with a click listener (opens info window)
        const infoWindow = new google.maps.InfoWindow({
          content: renderToString(<MapPopupCard shop={shop} />),
        });

        marker.addListener("gmp-click", ()=>{
          infoWindow.open(map, marker);
        });
      }
    });

    // Add star marker (5 star coffee)
    if (highlightedCoffee?.coffeeShop?.lat && highlightedCoffee?.coffeeShop?.lng) {
      const emojiDiv = document.createElement("div");
      emojiDiv.textContent = "⭐";
      emojiDiv.style.fontSize = "30px"; 
    
      const spotlightMarker = new markerLib.AdvancedMarkerElement({
        map,
        position: {
          lat: highlightedCoffee.coffeeShop.lat,
          lng: highlightedCoffee.coffeeShop.lng,
        },
        title: `⭐ ${highlightedCoffee.name}`,
        content: emojiDiv,
      });

      markerMap[highlightedCoffee.coffeeShop.id] = spotlightMarker;

      const infoWindow = new google.maps.InfoWindow({
        content: renderToString(<MapPopupCard shop={highlightedCoffee.coffeeShop} />),
      });

      spotlightMarker.addListener("gmp-click", ()=>{
        infoWindow.open(map, spotlightMarker);
      });
    }

    onMarkersReady?.(markerMap);
  }, [coffeeShops, mapLoaded, onMarkersReady]);

  return (
    <div
      ref={mapRef}
      className={className}   
    />
  );
});

export default Map;
