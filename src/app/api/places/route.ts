import { NextResponse } from 'next/server';

// Gets lat and long of place
export async function GET(request: Request) {
  const url = new URL(request.url);
  const place_id = url.searchParams.get('place_id');
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!place_id || typeof place_id !== 'string') {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
  }

  console.log('place id', place_id);
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?fields=geometry&place_id=${place_id}&key=${apiKey}`
    );

    const data = await response.json();
    console.log('data',data.result);

    if (response.ok && data.result) {
      const { geometry } = data.result;
      return NextResponse.json({
        lat: geometry?.location.lat,
        lng: geometry?.location.lng,
      });
    } else {
      return NextResponse.json({ error: 'Error fetching place details' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json({ error: 'Error fetching place details' }, { status: 500 });
  }
}
