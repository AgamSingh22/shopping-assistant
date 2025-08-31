// src/lib/parseCommand.js
const NUM_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10, dozen: 12
};

const toNum = (s) => (s && !isNaN(+s)) ? +s : NUM_WORDS[s?.toLowerCase()] ?? null;

export default function parseCommand(text = "") {
  const t = text.toLowerCase().trim();
  if (!t) return null;

  const isAdd    = /\b(add|buy|include|put)\b/.test(t);
  const isRemove = /\b(remove|delete|drop)\b/.test(t);
  const isSearch = /\b(find|search|look for)\b/.test(t);

  // --- Quantity ---
  let qty = 1;
  const qm = t.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|dozen)\b/);
  if (qm) qty = toNum(qm[1]) || 1;

  // --- Extract item ---
  let item = t;
  if (qm) {
    const idx = t.indexOf(qm[0]);
    item = t.slice(idx + qm[0].length).trim();
  }
  item = item
    .replace(/\b(add|buy|include|put|remove|delete|drop|find|search|look for)\b/g, "")
    .replace(/\b(under|below|less than)\s*\d+.*/g, "")
    .replace(/\b(of|to|the|a|an|my)\b/g, "")
    .replace(/[.,!?]/g, "")
    .split(" ")
    .filter(w => isNaN(w)) // remove leftover numbers
    .join(" ")
    .trim();

  // --- Price ---
  let priceMax = null;
  const pm = t.match(/\b(under|below|less than)\s*(₹|\$)?\s*(\d+)\b/);
  if (pm) priceMax = +pm[3];

  if (!item) return null;

  if (isAdd)    return { intent: "add", item, qty };
  if (isRemove) return { intent: "remove", item };
  if (isSearch) return { intent: "search", item, priceMax };
  return null;
}
