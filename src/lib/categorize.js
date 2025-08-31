const categories = {
  dairy: ["milk", "cheese", "butter", "curd", "yogurt", "ghee"],
  produce: ["apple", "banana", "tomato", "potato", "onion", "mango"],
  bakery: ["bread", "cake", "bun"],
  grains: ["rice", "wheat", "oats", "quinoa"],
  beverages: ["tea", "coffee", "juice", "cola"],
  snacks: ["chips", "cookies", "biscuits", "namkeen"],
  personal: ["toothpaste", "soap", "shampoo"],
};

export default function categorize(itemName = "") {
  const lower = itemName.toLowerCase();
  for (const [cat, words] of Object.entries(categories)) {
    if (words.some(w => lower.includes(w))) return cat;
  }
  return "others";
}
