import { useState, useRef, useEffect } from "react";
import { TOONS, TRINKETS, TRINKET_CATEGORIES } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SelectedItem {
  id: string;
  name: string;
  type: "toon" | "trinket";
  count: number;
}

export default function Home() {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [lastTapTime, setLastTapTime] = useState<{ [key: string]: number }>({});
  const longPressTimer = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const addItem = (id: string, name: string, type: "toon" | "trinket", count: number = 1) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === id && item.type === type);
      if (existing) {
        return prev.map((item) =>
          item.id === id && item.type === type ? { ...item, count: item.count + count } : item
        );
      }
      return [...prev, { id, name, type, count }];
    });
  };

  const removeItem = (id: string, type: "toon" | "trinket") => {
    setSelectedItems((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
  };

  const decrementItem = (id: string, type: "toon" | "trinket") => {
    setSelectedItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.type === type ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const handleMouseDown = (id: string, name: string, type: "toon" | "trinket") => {
    longPressTimer.current[id] = setTimeout(() => {
      if (type === "trinket") {
        addItem(id, name, type, 2);
      }
    }, 500);
  };

  const handleMouseUp = (id: string) => {
    if (longPressTimer.current[id]) {
      clearTimeout(longPressTimer.current[id]);
      delete longPressTimer.current[id];
    }
  };

  const handleTap = (id: string, name: string, type: "toon" | "trinket") => {
    const now = Date.now();
    const lastTap = lastTapTime[id] || 0;

    if (now - lastTap < 300) {
      // Double tap detected
      addItem(id, name, type, 1);
      setLastTapTime((prev) => ({ ...prev, [id]: 0 }));
    } else {
      // Single tap
      addItem(id, name, type, 1);
      setLastTapTime((prev) => ({ ...prev, [id]: now }));
    }
  };

  const toonCount = selectedItems.filter((item) => item.type === "toon").reduce((sum, item) => sum + item.count, 0);
  const trinketCount = selectedItems.filter((item) => item.type === "trinket").reduce((sum, item) => sum + item.count, 0);

  const groupedTrinkets = TRINKETS.reduce(
    (acc, trinket) => {
      if (!acc[trinket.category]) {
        acc[trinket.category] = [];
      }
      acc[trinket.category].push(trinket);
      return acc;
    },
    {} as { [key: string]: typeof TRINKETS }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D0A4E] via-[#1a0033] to-[#0f001a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663496711826/Vt3v4W9LkaTqW7vExkUkeM/hero-background-mpHfMzvKVZCfbwrvR82aLi.webp"
          alt="Hero Background"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D0A4E] opacity-80" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663496711826/Vt3v4W9LkaTqW7vExkUkeM/logo-dVaxrdE7CzKHchtm8r5fAX.webp"
              alt="Logo"
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF1493] via-[#00FFFF] to-[#00FF00] bg-clip-text text-transparent">
              Team Maker
            </h1>
          </div>
          <p className="text-[#00FFFF] text-lg font-semibold">Pick Your Dream Dandy's World Squad!</p>
          <p className="text-gray-400 text-sm mt-2">Single-tap to add • Double-tap for more • Long-press trinkets for 2x</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Toons Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-2xl font-bold text-[#00FFFF] mb-4 flex items-center gap-2">
                <span className="text-2xl">🎭</span> Toons
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF1493] scrollbar-track-[#2D0A4E]">
                {TOONS.map((toon) => (
                  <button
                    key={toon.id}
                    onMouseDown={() => handleMouseDown(toon.id, toon.name, "toon")}
                    onMouseUp={() => handleMouseUp(toon.id)}
                    onMouseLeave={() => handleMouseUp(toon.id)}
                    onClick={() => handleTap(toon.id, toon.name, "toon")}
                    className="relative group p-3 rounded-lg bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] hover:border-[#FF1493] transition-all duration-200 hover:shadow-lg hover:shadow-[#FF1493]/50 transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎪</div>
                      <p className="text-xs font-semibold text-[#00FFFF] group-hover:text-[#FF1493] transition-colors truncate">
                        {toon.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trinkets Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#00FF00] mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> Trinkets
            </h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF1493] scrollbar-track-[#2D0A4E]">
              {Object.entries(groupedTrinkets).map(([category, trinkets]) => (
                <div key={category}>
                  <h3 className="text-sm font-bold text-[#FF1493] mb-3 uppercase tracking-wider">
                    {TRINKET_CATEGORIES[category as keyof typeof TRINKET_CATEGORIES]}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {trinkets.map((trinket) => (
                      <button
                        key={trinket.id}
                        onMouseDown={() => handleMouseDown(trinket.id, trinket.name, "trinket")}
                        onMouseUp={() => handleMouseUp(trinket.id)}
                        onMouseLeave={() => handleMouseUp(trinket.id)}
                        onClick={() => handleTap(trinket.id, trinket.name, "trinket")}
                        className="relative group p-3 rounded-lg bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FF00] hover:border-[#FF1493] transition-all duration-200 hover:shadow-lg hover:shadow-[#00FF00]/50 transform hover:scale-105 active:scale-95"
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">💎</div>
                          <p className="text-xs font-semibold text-[#00FF00] group-hover:text-[#FF1493] transition-colors truncate">
                            {trinket.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Summary */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] shadow-lg shadow-[#00FFFF]/30">
          <h2 className="text-2xl font-bold text-[#FF1493] mb-4 flex items-center gap-2">
            <span className="text-2xl">🎮</span> Your Team
          </h2>

          {selectedItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No items selected yet. Start building your team!</p>
          ) : (
            <div className="space-y-4">
              {/* Toons */}
              {selectedItems.filter((item) => item.type === "toon").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#00FFFF] mb-3">Toons ({toonCount})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItems
                      .filter((item) => item.type === "toon")
                      .map((item) => (
                        <div
                          key={`${item.id}-${item.type}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white font-semibold text-sm shadow-lg shadow-[#FF1493]/50"
                        >
                          <span>{item.name}</span>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">x{item.count}</span>
                          <button
                            onClick={() => decrementItem(item.id, item.type)}
                            className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Trinkets */}
              {selectedItems.filter((item) => item.type === "trinket").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#00FF00] mb-3">Trinkets ({trinketCount})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItems
                      .filter((item) => item.type === "trinket")
                      .map((item) => (
                        <div
                          key={`${item.id}-${item.type}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00FF00] to-[#00FFFF] text-[#0f001a] font-semibold text-sm shadow-lg shadow-[#00FF00]/50"
                        >
                          <span>{item.name}</span>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">x{item.count}</span>
                          <button
                            onClick={() => decrementItem(item.id, item.type)}
                            className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Clear All Button */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setSelectedItems([])}
                  className="bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF1493] hover:to-[#FF1493] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70"
                >
                  Clear Team
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
