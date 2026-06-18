import { useState } from "react";
import { TOONS, TRINKETS } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { X, Copy, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface ToonWithTrinkets {
  toonId: string;
  toonName: string;
  trinkets: string[]; // trinket IDs
  count: number; // 1-8x multiplier
}

export default function Home() {
  const [team, setTeam] = useState<ToonWithTrinkets[]>([]);
  const [editingToonIndex, setEditingToonIndex] = useState<number | null>(null);
  const [tempTrinkets, setTempTrinkets] = useState<string[]>([]);
  const [trinketSearch, setTrinketSearch] = useState("");
  const [atStartText, setAtStartText] = useState("");
  const [showAtStartModal, setShowAtStartModal] = useState(false);

  // Add a new toon to the team
  const addToon = (toonId: string, toonName: string) => {
    const newToon: ToonWithTrinkets = {
      toonId,
      toonName,
      trinkets: [],
      count: 1,
    };
    setTeam([...team, newToon]);
    toast.success(`Added ${toonName} to team!`);
  };

  // Update toon count (1-8x)
  const updateToonCount = (index: number, newCount: number) => {
    if (newCount < 1 || newCount > 8) return;
    setTeam((prev) =>
      prev.map((toon, i) =>
        i === index ? { ...toon, count: newCount } : toon
      )
    );
  };

  // Open trinket editor for a specific toon
  const openTrinketEditor = (index: number) => {
    setEditingToonIndex(index);
    setTempTrinkets([...team[index].trinkets]);
    setTrinketSearch("");
  };

  // Close trinket editor
  const closeTrinketEditor = () => {
    setEditingToonIndex(null);
    setTempTrinkets([]);
    setTrinketSearch("");
  };

  // Toggle trinket selection
  const toggleTrinket = (trinketId: string) => {
    setTempTrinkets((prev) => {
      if (prev.includes(trinketId)) {
        return prev.filter((id) => id !== trinketId);
      }
      // Limit to 2 trinkets
      if (prev.length >= 2) {
        toast.error("Maximum 2 trinkets per Toon!");
        return prev;
      }
      return [...prev, trinketId];
    });
  };

  // Save trinkets for the edited toon
  const saveTrinkets = () => {
    if (editingToonIndex === null) return;

    setTeam((prev) =>
      prev.map((toon, i) =>
        i === editingToonIndex ? { ...toon, trinkets: tempTrinkets } : toon
      )
    );

    const trinketNames = tempTrinkets
      .map((id) => TRINKETS.find((t) => t.id === id)?.name)
      .filter(Boolean);

    toast.success(
      `Updated ${team[editingToonIndex].toonName} with ${tempTrinkets.length} trinket(s)!`
    );

    closeTrinketEditor();
  };

  // Remove a toon from the team
  const removeToon = (index: number) => {
    const toonName = team[index].toonName;
    setTeam((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed ${toonName} from team`);
  };

  // Copy full team to clipboard
  const copyTeamToClipboard = () => {
    let teamText = "";
    
    // Add "At Start" text if provided
    if (atStartText.trim()) {
      teamText = atStartText.trim() + "\n";
    }
    
    teamText += team
      .map((toon) => {
        const trinketNames = toon.trinkets
          .map((id) => TRINKETS.find((t) => t.id === id)?.name)
          .filter(Boolean)
          .join(", ");

        const countText = toon.count > 1 ? ` (${toon.count}x)` : "";
        return trinketNames
          ? `${toon.toonName}${countText} (${trinketNames})`
          : `${toon.toonName}${countText}`;
      })
      .join("\n");

    navigator.clipboard.writeText(teamText);
    toast.success("Team copied to clipboard!");
  };

  // Clear entire team
  const clearTeam = () => {
    setTeam([]);
    toast.success("Team cleared");
  };

  // Filter trinkets based on search
  const filteredTrinkets = TRINKETS.filter((trinket) =>
    trinket.name.toLowerCase().includes(trinketSearch.toLowerCase())
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
          <p className="text-gray-400 text-sm mt-2">Click Toon to add • Adjust count (1-8x) • Edit Trinkets • Copy to paste in game</p>
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
                    onClick={() => addToon(toon.id, toon.name)}
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

          {/* Team Section */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-[#FF1493] mb-4 flex items-center gap-2">
              <span className="text-2xl">🎮</span> Your Team ({team.length})
            </h2>

            {team.length === 0 ? (
              <div className="p-8 rounded-lg bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#2D0A4E] text-center">
                <p className="text-gray-400 text-lg">No Toons selected yet.</p>
                <p className="text-gray-500 text-sm mt-2">Click a Toon on the left to add it to your team!</p>
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
                            <h3 className="text-lg font-bold text-[#FF1493]">
                              {toon.toonName} {toon.count > 1 && <span className="text-[#00FF00]">({toon.count}x)</span>}
                            </h3>
                            {trinketNames.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {trinketNames.length}/2 trinkets
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

                        {/* Count Multiplier */}
                        <div className="mb-3 p-2 rounded-lg bg-[#00FF00]/10 border border-[#00FF00]/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#00FF00] font-semibold">Count:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateToonCount(index, toon.count - 1)}
                                disabled={toon.count <= 1}
                                className="p-1 rounded bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold text-[#00FF00] w-6 text-center">{toon.count}x</span>
                              <button
                                onClick={() => updateToonCount(index, toon.count + 1)}
                                disabled={toon.count >= 8}
                                className="p-1 rounded bg-[#00FFFF]/20 hover:bg-[#00FFFF]/40 text-[#00FFFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openTrinketEditor(index)}
                            className="flex-1 px-3 py-2 rounded-lg bg-[#00FFFF]/20 hover:bg-[#00FFFF]/40 text-[#00FFFF] text-xs font-semibold transition-colors"
                          >
                            Edit Trinkets
                          </button>
                          <button
                            onClick={() => {
                              const countText = toon.count > 1 ? ` (${toon.count}x)` : "";
                              const text = trinketNames.length > 0 
                                ? `${toon.toonName}${countText} (${trinketNames.join(", ")})`
                                : `${toon.toonName}${countText}`;
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
                    onClick={() => setShowAtStartModal(true)}
                    className="bg-gradient-to-r from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70 flex items-center justify-center gap-2"
                  >
                    At Start
                  </Button>
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
      {editingToonIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeTrinketEditor}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] rounded-lg shadow-2xl shadow-[#00FFFF]/50 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FF1493]">
                Trinkets for {team[editingToonIndex]?.toonName}
              </h2>
              <button
                onClick={closeTrinketEditor}
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
                    onClick={() => toggleTrinket(trinket.id)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      tempTrinkets.includes(trinket.id)
                        ? "border-[#FF1493] bg-[#FF1493]/20 shadow-lg shadow-[#FF1493]/50"
                        : "border-[#00FF00] bg-gradient-to-br from-[#0f001a] to-[#1a0033] hover:border-[#00FFFF]"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💎</div>
                      <p className="text-xs font-semibold text-[#00FF00]">{trinket.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{trinket.category}</p>
                      {tempTrinkets.includes(trinket.id) && (
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
                onClick={closeTrinketEditor}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={saveTrinkets}
                className="flex-1 bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF1493] hover:to-[#FF1493] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70 cursor-pointer"
              >
                Save ({tempTrinkets.length}/2)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* At Start Modal */}
      {showAtStartModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAtStartModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#FF1493] rounded-lg shadow-2xl shadow-[#FF1493]/50 max-w-md w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FF1493]">
                Add Text at Start
              </h2>
              <button
                onClick={() => setShowAtStartModal(false)}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#FF1493]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1">
              <p className="text-sm text-gray-400 mb-4">Enter text that will appear at the start of your copied team. Leave blank to add nothing.</p>
              <textarea
                value={atStartText}
                onChange={(e) => setAtStartText(e.target.value)}
                placeholder="e.g., My awesome team:"
                className="w-full px-4 py-3 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#FF1493] focus:outline-none resize-none h-24"
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
              <Button
                onClick={() => setShowAtStartModal(false)}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowAtStartModal(false);
                  toast.success("At Start text updated!");
                }}
                className="flex-1 bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF1493] hover:to-[#FF1493] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70 cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
