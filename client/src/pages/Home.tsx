import { useState, useRef, useEffect } from "react";
import { TOONS, TRINKETS, TRINKET_CATEGORIES } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { X, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ToonWithTrinkets {
  toonId: string;
  toonName: string;
  trinkets: string[]; // trinket IDs
}

export default function Home() {
  const [team, setTeam] = useState<ToonWithTrinkets[]>([]);
  const [holdingToon, setHoldingToon] = useState<string | null>(null);
  const [showTrinketModal, setShowTrinketModal] = useState(false);
  const [selectedTrinkets, setSelectedTrinkets] = useState<string[]>([]);
  const [trinketSearch, setTrinketSearch] = useState("");
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const handleToonPointerDown = (toonId: string, toonName: string) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setHoldingToon(toonId);
      setShowTrinketModal(true);
      setSelectedTrinkets([]);
      setTrinketSearch("");
    }, 500);
  };

  const handleToonPointerUp = (e: React.PointerEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleToonClick = (e: React.MouseEvent, toonId: string, toonName: string) => {
    // If long-press was triggered, don't add toon on click
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Add toon to team with no trinkets
    const newToon: ToonWithTrinkets = {
      toonId,
      toonName,
      trinkets: [],
    };
    setTeam([...team, newToon]);
    toast.success(`Added ${toonName} to team!`);
  };

  const addTrinketToToon = (trinketId: string) => {
    if (!holdingToon) return;

    setSelectedTrinkets((prev) => {
      if (prev.includes(trinketId)) {
        return prev.filter((id) => id !== trinketId);
      }
      return [...prev, trinketId];
    });
  };

  const confirmTrinkets = () => {
    if (!holdingToon) return;

    setTeam((prev) =>
      prev.map((toon) =>
        toon.toonId === holdingToon
          ? { ...toon, trinkets: selectedTrinkets }
          : toon
      )
    );

    const trinketNames = selectedTrinkets
      .map((id) => TRINKETS.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    toast.success(
      `Added ${selectedTrinkets.length} trinket(s) to ${TOONS.find((t) => t.id === holdingToon)?.name}!`
    );

    setShowTrinketModal(false);
    setHoldingToon(null);
    setSelectedTrinkets([]);
  };

  const removeToon = (index: number) => {
    const toonName = team[index].toonName;
    setTeam((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed ${toonName} from team`);
  };

  const copyTeamToClipboard = () => {
    const teamText = team
      .map((toon) => {
        const trinketNames = toon.trinkets
          .map((id) => TRINKETS.find((t) => t.id === id)?.name)
          .filter(Boolean)
          .join(", ");

        return trinketNames ? `${toon.toonName} (${trinketNames})` : toon.toonName;
      })
      .join("\n");

    navigator.clipboard.writeText(teamText);
    toast.success("Team copied to clipboard!");
  };

  const clearTeam = () => {
    setTeam([]);
    toast.success("Team cleared");
  };

  const filteredTrinkets = TRINKETS.filter((trinket) =>
    trinket.name.toLowerCase().includes(trinketSearch.toLowerCase())
  );

  const closeModal = () => {
    setShowTrinketModal(false);
    setHoldingToon(null);
    setSelectedTrinkets([]);
  };

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
          <p className="text-gray-400 text-sm mt-2">Click to add Toon • Hold to add Trinkets • Copy to paste in game</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Toons Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-2xl font-bold text-[#00FFFF] mb-4 flex items-center gap-2">
                <span className="text-2xl">🎭</span> Toons
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF1493] scrollbar-track-[#2D0A4E]">
                {TOONS.map((toon) => (
                  <button
                    key={toon.id}
                    onPointerDown={() => handleToonPointerDown(toon.id, toon.name)}
                    onPointerUp={handleToonPointerUp}
                    onPointerCancel={handleToonPointerUp}
                    onClick={(e) => handleToonClick(e, toon.id, toon.name)}
                    className="relative group p-3 rounded-lg bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] hover:border-[#FF1493] transition-all duration-200 hover:shadow-lg hover:shadow-[#FF1493]/50 transform hover:scale-105 active:scale-95 touch-manipulation"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎪</div>
                      <p className="text-xs font-semibold text-[#00FFFF] group-hover:text-[#FF1493] transition-colors truncate">
                        {toon.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Hold for trinkets</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-[#FF1493] mb-4 flex items-center gap-2">
              <span className="text-2xl">🎮</span> Your Team ({team.length})
            </h2>

            {team.length === 0 ? (
              <div className="p-8 rounded-lg bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#2D0A4E] text-center">
                <p className="text-gray-400 text-lg">No Toons selected yet.</p>
                <p className="text-gray-500 text-sm mt-2">Click a Toon to add it, or hold to add Trinkets!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Team Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.map((toon, index) => {
                    const trinketNames = toon.trinkets
                      .map((id) => TRINKETS.find((t) => t.id === id)?.name)
                      .filter(Boolean);

                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] shadow-lg shadow-[#00FFFF]/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-[#FF1493]">{toon.toonName}</h3>
                            {trinketNames.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {trinketNames.length} trinket{trinketNames.length !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeToon(index)}
                            className="p-2 rounded-lg bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {trinketNames.length > 0 && (
                          <div className="mb-3 space-y-1">
                            {trinketNames.map((name, i) => (
                              <div key={i} className="text-xs text-[#00FF00] bg-[#00FF00]/10 px-2 py-1 rounded">
                                ✨ {name}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onPointerDown={() => handleToonPointerDown(toon.toonId, toon.toonName)}
                            onPointerUp={handleToonPointerUp}
                            onPointerCancel={handleToonPointerUp}
                            className="flex-1 px-3 py-2 rounded-lg bg-[#00FFFF]/20 hover:bg-[#00FFFF]/40 text-[#00FFFF] text-xs font-semibold transition-colors touch-manipulation"
                          >
                            Edit Trinkets
                          </button>
                          <button
                            onClick={() => {
                              const text = trinketNames.length > 0 
                                ? `${toon.toonName} (${trinketNames.join(", ")})`
                                : toon.toonName;
                              navigator.clipboard.writeText(text);
                              toast.success(`Copied ${toon.toonName}!`);
                            }}
                            className="px-3 py-2 rounded-lg bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={copyTeamToClipboard}
                    className="flex-1 bg-gradient-to-r from-[#00FF00] to-[#00FFFF] hover:from-[#00FF00] hover:to-[#00FFFF] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FF00]/50 transition-all hover:shadow-[#00FF00]/70 flex items-center justify-center gap-2"
                  >
                    <Copy size={18} /> Copy Full Team
                  </Button>
                  <Button
                    onClick={clearTeam}
                    className="bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF1493] hover:to-[#FF1493] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Clear Team
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trinket Selection Modal */}
      {showTrinketModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] rounded-lg shadow-2xl shadow-[#00FFFF]/50 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FF1493]">
                Select Trinkets for {TOONS.find((t) => t.id === holdingToon)?.name}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#FF1493]" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#2D0A4E]">
              <input
                type="text"
                placeholder="Search trinkets..."
                value={trinketSearch}
                onChange={(e) => setTrinketSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#00FFFF] focus:outline-none"
              />
            </div>

            {/* Trinkets Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredTrinkets.map((trinket) => (
                  <button
                    key={trinket.id}
                    onClick={() => addTrinketToToon(trinket.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTrinkets.includes(trinket.id)
                        ? "border-[#FF1493] bg-[#FF1493]/20 shadow-lg shadow-[#FF1493]/50"
                        : "border-[#00FF00] bg-gradient-to-br from-[#0f001a] to-[#1a0033] hover:border-[#00FFFF]"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💎</div>
                      <p className="text-xs font-semibold text-[#00FF00]">{trinket.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{trinket.category}</p>
                      {selectedTrinkets.includes(trinket.id) && (
                        <div className="text-xs text-[#FF1493] font-bold mt-2">✓ Selected</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
              <Button
                onClick={closeModal}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmTrinkets}
                className="flex-1 bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF1493] hover:to-[#FF1493] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70"
              >
                Confirm ({selectedTrinkets.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
