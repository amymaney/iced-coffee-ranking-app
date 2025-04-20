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
  location: string;
  lat: number;
  lng: number;
}

export type MarkerMap = Record<number, google.maps.marker.AdvancedMarkerElement>;

interface MapProps {
  coffeeShops: CoffeeShop[];
  onMarkersReady?: (markerMap: MarkerMap) => void;
}

const Map = forwardRef(function Map({ coffeeShops, onMarkersReady }: MapProps, ref) {
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

  // Create map + markers
  useEffect(() => {
    if (!mapLoaded || !window.google || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 51.509865, lng: -0.118092 },
      zoom: 12,
      mapId: "23d1afba9d0a35d",
    });

    const markerMap: MarkerMap = {};
    const markerLib = (google.maps as any).marker;
    if (!markerLib?.AdvancedMarkerElement) return;

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
  }, [coffeeShops, mapLoaded, onMarkersReady]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[450px] rounded-xl mt-4 mb-4"
    />
  );
});

export default Map;
