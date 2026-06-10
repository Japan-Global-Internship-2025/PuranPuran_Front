const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const DEFAULT_LAT = 35.1706;
const DEFAULT_LNG = 136.9067;

export async function geocodePlace(name, region = "") {
  try {
    const query = region ? `${name} ${region} Japan` : `${name} Japan`;
    const url = `${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "ja,ko" } });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {}
  return null;
}

// Nominatim 1req/s 제한 준수: 순차 처리, 아이템마다 setState 콜백으로 즉시 반영
export async function geocodePlacesSequential(items, region, onUpdate) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.lat !== DEFAULT_LAT || item.lng !== DEFAULT_LNG) continue;
    if (i > 0) await new Promise((r) => setTimeout(r, 1200));
    const coords = await geocodePlace(item.name, region);
    if (coords) onUpdate(item.id, coords);
  }
}
