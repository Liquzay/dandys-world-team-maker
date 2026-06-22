import { useState, useEffect } from "react";
import { TOONS, TRINKETS } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { X, Copy, Trash2, Plus, Minus, Folder, Save, Wand2, Loader, Menu, Share2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import AccountPage from "./Account";
import CommunityPage from "./Community";
import { useAuth } from "@/_core/hooks/useAuth";

interface ToonWithTrinkets {
  toonId: string;
  toonName: string;
  customName?: string; // custom name for the toon
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
  const [savedLayouts, setSavedLayouts] = useState<Array<{id: string; name: string; team: ToonWithTrinkets[]; atStartText: string}>>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [renamingToonIndex, setRenamingToonIndex] = useState<number | null>(null);
  const [renameToonValue, setRenameToonValue] = useState("");
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomDescription, setRandomDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const generateTeamMutation = trpc.team.generateRandomTeam.useMutation();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showCustomToonModal, setShowCustomToonModal] = useState(false);
  const [showCustomTrinketModal, setShowCustomTrinketModal] = useState(false);
  const [customToonName, setCustomToonName] = useState("");
  const [customToonDesc, setCustomToonDesc] = useState("");
  const [customTrinketName, setCustomTrinketName] = useState("");
  const [customTrinketCategory, setCustomTrinketCategory] = useState("Shop");
  const [customTrinketRarity, setCustomTrinketRarity] = useState("Common");
  const [customTrinketDesc, setCustomTrinketDesc] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTeamName, setShareTeamName] = useState("");
  const [shareTeamDesc, setShareTeamDesc] = useState("");
  const { user, isAuthenticated } = useAuth();
  const createCustomToonMutation = trpc.customToons.create.useMutation();
  const createCustomTrinketMutation = trpc.customTrinkets.create.useMutation();
<<<<<<< Updated upstream
  const { data: customToons = [] } = trpc.customToons.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: customTrinkets = [] } = trpc.customTrinkets.list.useQuery(undefined, { enabled: isAuthenticated });
=======
>>>>>>> Stashed changes
  const utils = trpc.useUtils();
  const deleteCustomToonMutation = trpc.customToons.delete.useMutation({
    onSuccess: () => utils.customToons.list.invalidate(),
  });
  const deleteCustomTrinketMutation = trpc.customTrinkets.delete.useMutation({
    onSuccess: () => utils.customTrinkets.list.invalidate(),
  });
<<<<<<< Updated upstream
=======
  const shareTeamMutation = trpc.community.create.useMutation({
    onSuccess: () => {
      toast.success("Team shared to community!");
      setShowShareModal(false);
      setShareTeamName("");
      setShareTeamDesc("");
      utils.community.list.invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to share team");
    },
  });
  const { data: userProfile } = trpc.profile.getProfile.useQuery(undefined, { enabled: isAuthenticated });
>>>>>>> Stashed changes

  // Load saved layouts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dandyTeamLayouts");
    if (saved) {
      try {
        setSavedLayouts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load layouts", e);
      }
    }
  }, []);

  // Save layouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dandyTeamLayouts", JSON.stringify(savedLayouts));
  }, [savedLayouts]);

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
        const displayName = toon.customName || toon.toonName;
        const trinketNames = toon.trinkets
          .map((id) => TRINKETS.find((t) => t.id === id)?.name)
          .filter(Boolean)
          .join(", ");

        const countText = toon.count > 1 ? ` (${toon.count}x)` : "";
        return trinketNames
          ? `${displayName}${countText} (${trinketNames})`
          : `${displayName}${countText}`;
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

  // Generate random team with AI
  const generateRandomTeam = async () => {
    if (!randomDescription.trim()) {
      toast.error("Please describe the team you want!");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateTeamMutation.mutateAsync({
        description: randomDescription,
      });

      const newTeam = result.team.map((item: any) => ({
        toonId: item.toonId,
        toonName: item.toonName,
        trinkets: item.trinkets,
        count: item.count,
      }));

      setTeam(newTeam);
      setShowRandomModal(false);
      setRandomDescription("");
      toast.success(`Generated team: ${result.description}!`);
    } catch (error) {
      toast.error("Failed to generate team. Try again!");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current team as a layout
  const saveLayout = () => {
    if (!saveName.trim()) {
      toast.error("Please enter a layout name");
      return;
    }
    const newLayout = {
      id: Date.now().toString(),
      name: saveName,
      team: team,
      atStartText: atStartText,
    };
    setSavedLayouts([...savedLayouts, newLayout]);
    setSaveName("");
    setShowSaveModal(false);
    toast.success(`Layout "${saveName}" saved!`);
  };

  // Load a saved layout
  const loadLayout = (layout: typeof savedLayouts[0]) => {
    setTeam(layout.team);
    setAtStartText(layout.atStartText);
    setShowLoadModal(false);
    toast.success(`Loaded layout "${layout.name}"!`);
  };

  // Delete a saved layout
  const deleteLayout = (id: string) => {
    setSavedLayouts(savedLayouts.filter((layout) => layout.id !== id));
    toast.success("Layout deleted");
  };

  // Rename a toon
  const renameToon = (index: number) => {
    if (!renameToonValue.trim()) {
      toast.error("Please enter a name");
      return;
    }
    setTeam((prev) =>
      prev.map((toon, i) =>
        i === index ? { ...toon, customName: renameToonValue } : toon
      )
    );
    setRenamingToonIndex(null);
    setRenameToonValue("");
    toast.success("Toon renamed!");
  };

  // Start renaming a toon
  const startRenaming = (index: number) => {
    setRenamingToonIndex(index);
    setRenameToonValue(team[index].customName || "");
  };

  // Share team to community
  const shareTeam = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to share teams");
      return;
    }

    if (!userProfile?.robloxUsername) {
      toast.error("Please set your Roblox username in Account settings first");
      return;
    }

    if (!shareTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (!shareTeamDesc.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (team.length === 0) {
      toast.error("Please build a team first");
      return;
    }

    try {
      await shareTeamMutation.mutateAsync({
        name: shareTeamName,
        description: shareTeamDesc,
        teamData: JSON.stringify(team),
      });
    } catch (error) {
      console.error(error);
    }
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
        {/* Hamburger Menu */}
        <div className="flex justify-between items-center mb-6 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] transition-colors"
          >
            <Menu size={24} />
          </button>
          {showMenu && (
            <div className="absolute top-12 left-0 bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#FF1493] rounded-lg shadow-2xl shadow-[#FF1493]/50 z-40 min-w-[220px]">
              <button
                onClick={() => {
                  setShowAccountModal(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-[#00FFFF] hover:bg-[#2D0A4E] transition-colors border-b border-[#2D0A4E] font-semibold"
              >
                👤 Account Settings
              </button>
              <button
                onClick={() => {
                  setShowLoadModal(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-[#00FFFF] hover:bg-[#2D0A4E] transition-colors border-b border-[#2D0A4E] font-semibold"
              >
                📂 My Layouts
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowCommunityModal(true);
                }}
                className="w-full px-4 py-3 text-left text-[#00FFFF] hover:bg-[#2D0A4E] transition-colors border-b border-[#2D0A4E] font-semibold"
              >
                🌍 Community
              </button>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setShowCustomToonModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[#00FF00] hover:bg-[#2D0A4E] transition-colors border-b border-[#2D0A4E] font-semibold"
                  >
                    ✨ Create Custom Toon
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomTrinketModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[#00FF00] hover:bg-[#2D0A4E] transition-colors font-semibold"
                  >
                    💎 Create Custom Trinket
                  </button>
                </>
              )}
            </div>
          )}
          <div className="text-sm text-[#00FF00] font-semibold">
            {isAuthenticated ? `Welcome, ${user?.name}!` : "Not logged in"}
          </div>
        </div>

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
                {[...TOONS, ...customToons].map((toon) => (
                  <button
                    key={toon.id}
                    onClick={() => addToon(String(toon.id), toon.name)}
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
                          <div className="flex-1">
                            {renamingToonIndex === index ? (
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={renameToonValue}
                                  onChange={(e) => setRenameToonValue(e.target.value)}
                                  className="flex-1 px-2 py-1 rounded-lg bg-[#0f001a] border border-[#FF1493] text-white text-sm focus:outline-none"
                                  autoFocus
                                  onKeyPress={(e) => e.key === "Enter" && renameToon(index)}
                                />
                                <button
                                  onClick={() => renameToon(index)}
                                  className="px-2 py-1 rounded-lg bg-[#00FF00]/20 hover:bg-[#00FF00]/40 text-[#00FF00] text-xs font-semibold transition-colors"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setRenamingToonIndex(null)}
                                  className="px-2 py-1 rounded-lg bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] text-xs font-semibold transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <h3 
                                onClick={() => startRenaming(index)}
                                className="text-lg font-bold text-[#FF1493] cursor-pointer hover:text-[#FF69B4] transition-colors"
                                title="Click to rename"
                              >
                                {toon.customName || toon.toonName} {toon.count > 1 && <span className="text-[#00FF00]">({toon.count}x)</span>}
                              </h3>
                            )}
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
                              <button
                                onClick={() => updateToonCount(index, 1)}
                                className="p-1 rounded bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] text-xs font-bold transition-colors"
                                title="Disable multiplier (set to 1x)"
                              >
                                1x
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
                              const displayName = toon.customName || toon.toonName;
                              const countText = toon.count > 1 ? ` (${toon.count}x)` : "";
                              const text = trinketNames.length > 0 
                                ? `${displayName}${countText} (${trinketNames.join(", ")})`
                                : `${displayName}${countText}`;
                              navigator.clipboard.writeText(text);
                              toast.success(`Copied ${displayName}!`);
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
                <div className="flex gap-3 mt-6 flex-wrap">
                  <Button
                    onClick={() => setShowLoadModal(true)}
                    className="bg-gradient-to-r from-[#00FFFF] to-[#00FF00] hover:from-[#00FF00] hover:to-[#00FFFF] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FFFF]/50 transition-all hover:shadow-[#00FFFF]/70 flex items-center justify-center gap-2"
                  >
                    <Folder size={18} /> Load
                  </Button>
                  <Button
                    onClick={() => setShowSaveModal(true)}
                    className="bg-gradient-to-r from-[#00FFFF] to-[#00FF00] hover:from-[#00FF00] hover:to-[#00FFFF] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FFFF]/50 transition-all hover:shadow-[#00FFFF]/70 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save
                  </Button>
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
                    onClick={() => setShowRandomModal(true)}
                    className="bg-gradient-to-r from-[#9D4EDD] to-[#7209B7] hover:from-[#7209B7] hover:to-[#9D4EDD] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#9D4EDD]/50 transition-all hover:shadow-[#9D4EDD]/70 flex items-center justify-center gap-2"
                  >
                    <Wand2 size={18} /> Random
                  </Button>
                  <Button
                    onClick={clearTeam}
                    className="bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF1493] hover:to-[#FF1493] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF1493]/50 transition-all hover:shadow-[#FF1493]/70 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Clear Team
                  </Button>
                  {isAuthenticated && (
                    <Button
                      onClick={() => setShowShareModal(true)}
                      className="bg-gradient-to-r from-[#FF6B9D] to-[#FFC75F] hover:from-[#FFC75F] hover:to-[#FF6B9D] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF6B9D]/50 transition-all hover:shadow-[#FF6B9D]/70 flex items-center justify-center gap-2"
                    >
                      <Share2 size={18} /> Share
                    </Button>
                  )}
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
                {[...filteredTrinkets, ...customTrinkets.filter(t => t.name.toLowerCase().includes(trinketSearch.toLowerCase()))].map((trinket) => (
                  <button
                    key={trinket.id}
                    onClick={() => toggleTrinket(String(trinket.id))}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      tempTrinkets.includes(String(trinket.id))
                        ? "border-[#FF1493] bg-[#FF1493]/20 shadow-lg shadow-[#FF1493]/50"
                        : "border-[#00FF00] bg-gradient-to-br from-[#0f001a] to-[#1a0033] hover:border-[#00FFFF]"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💎</div>
                      <p className="text-xs font-semibold text-[#00FF00]">{trinket.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{trinket.category}</p>
                      {tempTrinkets.includes(String(trinket.id)) && (
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

      {/* Save Layout Modal */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSaveModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] rounded-lg shadow-2xl shadow-[#00FFFF]/50 max-w-md w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#00FFFF]">Save Layout</h2>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#00FFFF]" />
              </button>
            </div>
            <div className="p-6 flex-1">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g., Dandy Run"
                className="w-full px-4 py-2 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#00FFFF] focus:outline-none"
                onKeyPress={(e) => e.key === "Enter" && saveLayout()}
              />
            </div>
            <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
              <Button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={saveLayout}
                className="flex-1 bg-gradient-to-r from-[#00FFFF] to-[#00FF00] hover:from-[#00FF00] hover:to-[#00FFFF] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FFFF]/50 transition-all hover:shadow-[#00FFFF]/70 cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Random Team Generator Modal */}
      {showRandomModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowRandomModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#9D4EDD] rounded-lg shadow-2xl shadow-[#9D4EDD]/50 max-w-md w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#9D4EDD]">AI Team Generator</h2>
              <button
                onClick={() => setShowRandomModal(false)}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#9D4EDD]" />
              </button>
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm text-gray-400 mb-4">Describe the team you want and AI will generate it for you!</p>
              <textarea
                value={randomDescription}
                onChange={(e) => setRandomDescription(e.target.value)}
                placeholder="e.g., A fast and aggressive team with lots of speed trinkets"
                className="w-full px-4 py-3 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#9D4EDD] focus:outline-none resize-none h-24"
              />
            </div>
            <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
              <Button
                onClick={() => setShowRandomModal(false)}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={generateRandomTeam}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-[#9D4EDD] to-[#7209B7] hover:from-[#7209B7] hover:to-[#9D4EDD] text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#9D4EDD]/50 transition-all hover:shadow-[#9D4EDD]/70 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} /> Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Load Layout Modal */}
      {showLoadModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLoadModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] rounded-lg shadow-2xl shadow-[#00FFFF]/50 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#00FFFF]">Load Layout</h2>
              <button
                onClick={() => setShowLoadModal(false)}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#00FFFF]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {savedLayouts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No saved layouts yet.</p>
              ) : (
                savedLayouts.map((layout) => (
                  <div
                    key={layout.id}
                    className="p-4 rounded-lg bg-gradient-to-br from-[#0f001a] to-[#1a0033] border border-[#00FFFF]/30 hover:border-[#00FFFF] transition-all flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <p className="text-[#00FFFF] font-semibold">{layout.name}</p>
                      <p className="text-xs text-gray-500">{layout.team.length} Toons</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadLayout(layout)}
                        className="px-3 py-1 rounded-lg bg-[#00FFFF]/20 hover:bg-[#00FFFF]/40 text-[#00FFFF] text-xs font-semibold transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteLayout(layout.id)}
                        className="px-3 py-1 rounded-lg bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountPage onClose={() => setShowAccountModal(false)} />
      )}

      {/* Community Modal */}
      {showCommunityModal && (
        <CommunityPage onClose={() => setShowCommunityModal(false)} />
      )}

      {/* Custom Toon Modal */}
      {showCustomToonModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FF00] rounded-lg shadow-2xl shadow-[#00FF00]/50 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#00FF00]">Create Custom Toon</h2>
              <button
                onClick={() => setShowCustomToonModal(false)}
                className="text-[#FF1493] hover:text-[#FF1493]/80"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#00FFFF] font-semibold mb-2">Toon Name *</label>
                <input
                  type="text"
                  value={customToonName}
                  onChange={(e) => setCustomToonName(e.target.value)}
                  placeholder="Enter toon name"
                  className="w-full px-3 py-2 bg-[#2D0A4E] border border-[#00FFFF] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00]"
                />
              </div>
              <div>
                <label className="block text-[#00FFFF] font-semibold mb-2">Description (optional)</label>
                <textarea
                  value={customToonDesc}
                  onChange={(e) => setCustomToonDesc(e.target.value)}
                  placeholder="Describe your custom toon"
                  className="w-full px-3 py-2 bg-[#2D0A4E] border border-[#00FFFF] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00] h-24"
                />
              </div>
              <button
                onClick={() => {
                  if (!customToonName.trim()) {
                    toast.error("Please enter a toon name");
                    return;
                  }
                  createCustomToonMutation.mutate(
                    { name: customToonName, description: customToonDesc },
                    {
                      onSuccess: () => {
                        toast.success("Custom toon created!");
                        setCustomToonName("");
                        setCustomToonDesc("");
                        setShowCustomToonModal(false);
                      },
                      onError: () => {
                        toast.error("Failed to create custom toon");
                      },
                    }
                  );
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#00FF00] to-[#00FFFF] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#00FF00]/50 transition-all"
              >
                {createCustomToonMutation.isPending ? "Creating..." : "Create Toon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Trinket Modal */}
      {showCustomTrinketModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#FF1493] rounded-lg shadow-2xl shadow-[#FF1493]/50 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#FF1493]">Create Custom Trinket</h2>
              <button
                onClick={() => setShowCustomTrinketModal(false)}
                className="text-[#00FFFF] hover:text-[#00FFFF]/80"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#00FFFF] font-semibold mb-2">Trinket Name *</label>
                <input
                  type="text"
                  value={customTrinketName}
                  onChange={(e) => setCustomTrinketName(e.target.value)}
                  placeholder="Enter trinket name"
                  className="w-full px-3 py-2 bg-[#2D0A4E] border border-[#00FFFF] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1493]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#00FFFF] font-semibold mb-2">Category *</label>
                  <select
                    value={customTrinketCategory}
                    onChange={(e) => setCustomTrinketCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2D0A4E] border border-[#00FFFF] rounded-lg text-white focus:outline-none focus:border-[#FF1493]"
                  >
                    <option>Shop</option>
                    <option>Twisted</option>
                    <option>Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#00FFFF] font-semibold mb-2">Rarity *</label>
                  <select
                    value={customTrinketRarity}
                    onChange={(e) => setCustomTrinketRarity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2D0A4E] border border-[#00FFFF] rounded-lg text-white focus:outline-none focus:border-[#FF1493]"
                  >
                    <option>Common</option>
                    <option>Uncommon</option>
                    <option>Rare</option>
                    <option>Lethal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#00FFFF] font-semibold mb-2">Description (optional)</label>
                <textarea
                  value={customTrinketDesc}
                  onChange={(e) => setCustomTrinketDesc(e.target.value)}
                  placeholder="Describe your custom trinket"
                  className="w-full px-3 py-2 bg-[#2D0A4E] border border-[#00FFFF] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1493] h-20"
                />
              </div>
              <button
                onClick={() => {
                  if (!customTrinketName.trim()) {
                    toast.error("Please enter a trinket name");
                    return;
                  }
                  createCustomTrinketMutation.mutate(
                    {
                      name: customTrinketName,
                      category: customTrinketCategory,
                      rarity: customTrinketRarity,
                      description: customTrinketDesc,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Custom trinket created!");
                        setCustomTrinketName("");
                        setCustomTrinketCategory("Shop");
                        setCustomTrinketRarity("Common");
                        setCustomTrinketDesc("");
                        setShowCustomTrinketModal(false);
                      },
                      onError: () => {
                        toast.error("Failed to create custom trinket");
                      },
                    }
                  );
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#FF1493] to-[#00FFFF] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FF1493]/50 transition-all"
              >
                {createCustomTrinketMutation.isPending ? "Creating..." : "Create Trinket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share to Community Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#FF6B9D] rounded-lg shadow-2xl shadow-[#FF6B9D]/50 max-w-md w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FF6B9D]">Share Team to Community</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#FF6B9D]" />
              </button>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div>
                <label className="block text-[#00FFFF] font-semibold mb-2">Team Name</label>
                <input
                  type="text"
                  value={shareTeamName}
                  onChange={(e) => setShareTeamName(e.target.value)}
                  placeholder="e.g., Speed Runner Build"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#FF6B9D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00FFFF] font-semibold mb-2">Description</label>
                <textarea
                  value={shareTeamDesc}
                  onChange={(e) => setShareTeamDesc(e.target.value)}
                  placeholder="Describe your team strategy and why it's effective..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#FF6B9D] focus:outline-none resize-none h-24"
                />
              </div>
            </div>
            <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
              <Button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={shareTeam}
                disabled={shareTeamMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#FF6B9D] to-[#FFC75F] hover:from-[#FFC75F] hover:to-[#FF6B9D] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#FF6B9D]/50 transition-all hover:shadow-[#FF6B9D]/70 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {shareTeamMutation.isPending ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Sharing...
                  </>
                ) : (
                  <>
                    <Share2 size={16} /> Share Team
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
