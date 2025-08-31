import { motion, AnimatePresence } from "framer-motion";

export default function ShoppingList({ items, inc, dec, removeItem }) {
  if (!items.length) return <div className="text-slate-500 text-sm mt-4">No items yet.</div>;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {items.map(i => (
          <motion.div
            key={i.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-xl border bg-white shadow-sm"
          >
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-slate-500 capitalize">{i.category}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => dec(i.id)} className="px-2 py-1 border rounded">-</button>
              <span className="w-6 text-center">{i.qty}</span>
              <button onClick={() => inc(i.id)} className="px-2 py-1 border rounded">+</button>
              <button onClick={() => removeItem(i.id)} className="px-2 py-1 border rounded text-red-500">✕</button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
