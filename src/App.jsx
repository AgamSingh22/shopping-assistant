import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, ShoppingCart, Send } from "lucide-react";

import useSpeech from "./hooks/useSpeech";
import useShoppingList from "./hooks/useShoppingList";
import parseCommand from "./lib/parseCommand";
import categorize from "./lib/categorize";

import ShoppingList from "./components/ShoppingList";
import Toast from "./components/Toast";
import SuggestionsPanel from "./components/SuggestionsPanel";
import useSmartAI from "./hooks/useSmartAI";

export default function App() {
  const { isListening, transcript, start, stop, reset, setLang, lang } =
    useSpeech("en-IN", { interim: true, continuous: true });

  const { items, addItem, removeItem, inc, dec, frequentItems } =
    useShoppingList();

  const { suggestions, seasonal } = useSmartAI(items);

  const [toast, setToast] = useState("");
  const [commandText, setCommandText] = useState("");
  const inputRef = useRef(null);

  const applyCommand = (text) => {
    const cmd = parseCommand(text || "");
    if (!cmd) return;

    if (cmd.intent === "add") {
      addItem(cmd.item, cmd.qty || 1, categorize(cmd.item));
      setToast(`✅ Added ${cmd.item}`);
    }
    if (cmd.intent === "remove") {
      removeItem(cmd.item);
      setToast(`❌ Removed ${cmd.item}`);
    }
    reset();
    setCommandText("");
    setTimeout(() => setToast(""), 2000);
  };

  const handleManualSubmit = () => {
    if (commandText.trim()) {
      applyCommand(commandText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleManualSubmit();
    }
  };

  const focusInput = () => {
    inputRef.current.focus();
  };

  if (transcript && !isListening) {
    applyCommand(transcript);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-100 to-orange-50 flex text-slate-800">
      <Toast message={toast} />

      {/* Sidebar Cart */}
      <aside className="w-72 bg-white shadow-lg border-r border-pink-200 flex flex-col">
        <header className="p-4 border-b border-pink-200 flex items-center gap-2">
          <ShoppingCart className="text-pink-500" />
          <h2 className="font-bold text-lg">Your Cart</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-3">
          <ShoppingList
            items={items}
            inc={inc}
            dec={dec}
            removeItem={removeItem}
          />
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="p-4 border-b border-pink-200 flex items-center gap-4 bg-white shadow-sm">
          <motion.button
            onClick={isListening ? stop : start}
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
              boxShadow: isListening
                ? [
                    "0 0 0 0 rgba(236,72,153,0.7)",
                    "0 0 0 20px rgba(236,72,153,0)",
                  ]
                : "0 0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-12 w-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg"
          >
            <Mic className="h-6 w-6" />
          </motion.button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                transcript || "Speak or type your shopping command..."
              }
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={handleManualSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-500"
            >
              <Send size={20} />
            </button>
          </div>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs border rounded px-2 py-1 bg-white shadow-sm"
          >
            <option value="en-IN">🇬🇧 EN</option>
            <option value="hi-IN">🇮🇳 HI</option>
            <option value="fr-FR">🇫🇷 FR</option>
          </select>
        </div>

        {/* Suggestions */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Smart Suggestions</h2>
          <SuggestionsPanel
            frequent={frequentItems}
            seasonal={seasonal}
            smart={suggestions}
            onAdd={(n) => addItem(n, 1, categorize(n))}
          />
        </div>
      </main>
    </div>
  );
}
