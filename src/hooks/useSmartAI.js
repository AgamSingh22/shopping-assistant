import { useEffect, useState } from "react";
import axios from "axios";

export default function useSmartAI(items) {
  const [suggestions, setSuggestions] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (!items.length || !apiKey) return;

    const fetchAI = async () => {
      setLoading(true);
      try {
        const itemNames = items.map((i) => i.name).join(", ");
        const prompt = `The cart contains: ${itemNames}.
        Suggest 3 useful shopping recommendations and list 3 seasonal fruits/vegetables right now. 
        Return the response as two lists:
        Suggestions: ...
        Seasonal: ...`;

        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const text =
          res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Split based on labels
        const suggestionsMatch = text.match(/Suggestions:([\s\S]*?)(Seasonal:|$)/i);
        const seasonalMatch = text.match(/Seasonal:([\s\S]*)/i);

        const suggestionList = suggestionsMatch
          ? suggestionsMatch[1].split(/[\n•-]/).map((s) => s.trim()).filter(Boolean)
          : [];

        const seasonalList = seasonalMatch
          ? seasonalMatch[1].split(/[\n•-]/).map((s) => s.trim()).filter(Boolean)
          : [];

        setSuggestions(suggestionList.slice(0, 3));
        setSeasonal(seasonalList.slice(0, 3));
      } catch (err) {
        console.error("Gemini AI fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [items, apiKey]);

  return { suggestions, seasonal, loading };
}
