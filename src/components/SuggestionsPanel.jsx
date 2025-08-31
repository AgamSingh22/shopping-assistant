import { Sparkles, Clock, Sprout } from "lucide-react";

export default function SuggestionsPanel({
  frequent = [],
  seasonal = [],
  smart = [],
  onAdd,
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-lg mb-4 text-yellow-600">
        <Sparkles size={20} /> Suggestions
      </h2>

      {/* Horizontal 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Frequent */}
        <div>
          <h3 className="flex items-center gap-2 font-medium text-sm mb-2 text-slate-600">
            <Clock size={16} /> Frequent
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {frequent.length ? (
              frequent.map((item, i) => (
                <button
                  key={i}
                  onClick={() => onAdd(item)}
                  className="w-full px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-sm text-left"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400">No frequent items yet.</p>
            )}
          </div>
        </div>

        {/* Seasonal */}
        <div>
          <h3 className="flex items-center gap-2 font-medium text-sm mb-2 text-slate-600">
            <Sprout size={16} /> Seasonal
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {seasonal.length ? (
              seasonal.map((item, i) => (
                <button
                  key={i}
                  onClick={() => onAdd(item)}
                  className="w-full px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-sm text-left"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400">No seasonal items found.</p>
            )}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div>
          <h3 className="flex items-center gap-2 font-medium text-sm mb-2 text-slate-600">
            <Sparkles size={16} /> Smart
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {smart.length ? (
              smart.map((item, i) => (
                <button
                  key={i}
                  onClick={() => onAdd(item)}
                  className="w-full px-3 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-sm text-left"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400">No smart suggestions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
