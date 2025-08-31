import { useEffect, useState } from "react";

export default function SearchResults({ query, priceMax }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    async function fetchData() {
      try {
        const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`);
        const data = await res.json();
        let items = data.products.map(p => ({
          name: p.product_name,
          brand: p.brands,
          image: p.image_front_small_url,
          price: Math.floor(Math.random() * 200) + 20 // fake price since API free
        }));
        if (priceMax) items = items.filter(p => p.price <= priceMax);
        setResults(items.slice(0, 5));
      } catch {
        setResults([]);
      }
    }
    fetchData();
  }, [query, priceMax]);

  if (!query) return <p className="text-sm text-slate-500">Say “find apples under 200”</p>;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {results.map((p, i) => (
        <div key={i} className="border rounded-xl p-2 bg-white">
          <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded mb-1" />
          <div className="text-sm font-medium">{p.name}</div>
          <div className="text-xs text-slate-500">{p.brand}</div>
          <div className="text-xs font-semibold">₹{p.price}</div>
        </div>
      ))}
    </div>
  );
}
