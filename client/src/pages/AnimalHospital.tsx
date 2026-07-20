import { useState } from "react";
import { ANIMAL_HOSPITAL_CLASSES } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Plus, Minus, Edit2, Save, Upload, Download, X } from "lucide-react";
import { toast } from "sonner";

interface HospitalTeamMember {
  classId: string;
  className: string;
  count: number;
  isCustom?: boolean;
}

interface SavedLayout {
  id: string;
  name: string;
  team: HospitalTeamMember[];
  atStartText: string;
  timestamp: number;
}

export default function AnimalHospital() {
  const [team, setTeam] = useState<HospitalTeamMember[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [atStartText, setAtStartText] = useState("");
  const [showAtStartModal, setShowAtStartModal] = useState(false);
  const [customClasses, setCustomClasses] = useState<typeof ANIMAL_HOSPITAL_CLASSES>([]);
  const [showCustomClassModal, setShowCustomClassModal] = useState(false);
  const [customClassName, setCustomClassName] = useState("");
  const [customClassDesc, setCustomClassDesc] = useState("");
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [layoutName, setLayoutName] = useState("");
  const [showLoadModal, setShowLoadModal] = useState(false);

  const addToTeam = (classId: string, className: string) => {
    const existing = team.find(t => t.classId === classId);
    if (existing) {
      if (existing.count < 8) {
        setTeam(team.map(t => t.classId === classId ? { ...t, count: t.count + 1 } : t));
      }
    } else {
      setTeam([...team, { classId, className, count: 1 }]);
    }
    toast.success(`Added ${className} to team!`);
  };

  const removeFromTeam = (classId: string) => {
    setTeam(team.filter(t => t.classId !== classId));
    toast.success("Removed from team");
  };

  const updateCount = (classId: string, newCount: number) => {
    if (newCount < 1 || newCount > 8) return;
    setTeam(team.map(t => t.classId === classId ? { ...t, count: newCount } : t));
  };

  const copyTeamToClipboard = () => {
    let teamText = "";
    
    if (atStartText.trim()) {
      teamText = atStartText.trim() + "\n";
    }
    
    teamText += team
      .map(t => `${t.className}${t.count > 1 ? ` (${t.count}x)` : ""}`)
      .join("\n");
    
    navigator.clipboard.writeText(teamText);
    toast.success("Team copied to clipboard!");
  };

  const clearTeam = () => {
    setTeam([]);
    toast.success("Team cleared");
  };

  const addCustomClass = () => {
    if (!customClassName.trim()) {
      toast.error("Please enter a class name");
      return;
    }
    const newClass = {
      id: `custom-${Date.now()}`,
      name: customClassName,
      description: customClassDesc || "Custom class",
      icon: "⭐"
    };
    setCustomClasses([...customClasses, newClass]);
    setCustomClassName("");
    setCustomClassDesc("");
    setShowCustomClassModal(false);
    toast.success("Custom class added!");
  };

  const deleteCustomClass = (classId: string) => {
    setCustomClasses(customClasses.filter(c => c.id !== classId));
    setTeam(team.filter(t => t.classId !== classId));
    toast.success("Custom class deleted");
  };

  const saveLayout = () => {
    if (!layoutName.trim()) {
      toast.error("Please enter a layout name");
      return;
    }
    const newLayout: SavedLayout = {
      id: `layout-${Date.now()}`,
      name: layoutName,
      team: [...team],
      atStartText,
      timestamp: Date.now()
    };
    setSavedLayouts([...savedLayouts, newLayout]);
    setLayoutName("");
    setShowSaveModal(false);
    toast.success("Layout saved!");
  };

  const loadLayout = (layout: SavedLayout) => {
    setTeam(layout.team);
    setAtStartText(layout.atStartText);
    setShowLoadModal(false);
    toast.success(`Loaded layout: ${layout.name}`);
  };

  const deleteLayout = (layoutId: string) => {
    setSavedLayouts(savedLayouts.filter(l => l.id !== layoutId));
    toast.success("Layout deleted");
  };

  const exportLayout = () => {
    const data = {
      team,
      atStartText,
      customClasses,
      timestamp: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hospital-team-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Team exported!");
  };

  const importLayout = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          setTeam(data.team || []);
          setAtStartText(data.atStartText || "");
          if (data.customClasses) {
            setCustomClasses(data.customClasses);
          }
          toast.success("Team imported!");
        } catch (error) {
          toast.error("Failed to import team");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const allClasses = [...ANIMAL_HOSPITAL_CLASSES, ...customClasses];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4d3e] to-[#0f2818] text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="/manus-storage/images(3)_87ee0a02.jpeg"
            alt="Animal Hospital Banner"
            className="w-full h-auto max-h-48 object-cover rounded-lg"
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4ECDC4] mb-2">Animal Hospital</h1>
          <p className="text-gray-300">Build your medical team and save lives</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#4ECDC4]">Medical Classes</h2>
              <Button
                onClick={() => setShowCustomClassModal(true)}
                className="bg-gradient-to-r from-[#FFB347] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFB347] text-white font-bold py-1 px-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> Add Custom
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allClasses.map((hospitalClass) => (
                <div
                  key={hospitalClass.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#4ECDC4] hover:border-[#45B7AA] transition-all cursor-pointer group relative"
                  onClick={() => addToTeam(hospitalClass.id, hospitalClass.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#4ECDC4] mb-2">{hospitalClass.name}</h3>
                      <p className="text-sm text-gray-300">{hospitalClass.description}</p>
                    </div>
                    {hospitalClass.id.startsWith("custom-") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomClass(hospitalClass.id);
                        }}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors ml-2"
                        title="Delete custom class"
                      >
                        <X size={16} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-[#4ECDC4] mb-4">Your Team ({team.length})</h2>
            
            {team.length === 0 ? (
              <div className="p-6 rounded-lg bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#2a6b5f] text-center">
                <p className="text-gray-400">No classes selected yet</p>
                <p className="text-gray-500 text-sm mt-2">Click a class to add it to your team</p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.map((member) => (
                  <div
                    key={member.classId}
                    className="p-3 rounded-lg bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#4ECDC4]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-[#4ECDC4]">{member.className}</h4>
                      <button
                        onClick={() => removeFromTeam(member.classId)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        title="Remove from team"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCount(member.classId, member.count - 1)}
                        className="p-1 hover:bg-[#4ECDC4]/20 rounded transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex-1 text-center font-bold">{member.count}</span>
                      <button
                        onClick={() => updateCount(member.classId, member.count + 1)}
                        className="p-1 hover:bg-[#4ECDC4]/20 rounded transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-6">
                  <Button
                    onClick={() => setShowAtStartModal(true)}
                    className="w-full bg-gradient-to-r from-[#FFB347] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFB347] text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> At Start
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyTeamToClipboard}
                      className="flex-1 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] hover:from-[#45B7AA] hover:to-[#4ECDC4] text-[#0f2818] font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Copy size={16} /> Copy
                    </Button>
                    <Button
                      onClick={clearTeam}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Clear
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowSaveModal(true)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Save
                    </Button>
                    <Button
                      onClick={() => setShowLoadModal(true)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Upload size={16} /> Load
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportLayout}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> Export
                    </Button>
                    <Button
                      onClick={importLayout}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Upload size={16} /> Import
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* At Start Modal */}
      {showAtStartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#4ECDC4] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#4ECDC4] mb-4">At Start</h2>
            <textarea
              value={atStartText}
              onChange={(e) => setAtStartText(e.target.value)}
              placeholder="Enter notes or items to use at start..."
              className="w-full h-32 p-3 rounded-lg bg-[#0f2818] border border-[#4ECDC4] text-white placeholder-gray-500 focus:outline-none focus:border-[#45B7AA]"
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => {
                  setShowAtStartModal(false);
                  toast.success("At Start saved!");
                }}
                className="flex-1 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] hover:from-[#45B7AA] hover:to-[#4ECDC4] text-[#0f2818] font-bold py-2 rounded-lg"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowAtStartModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Class Modal */}
      {showCustomClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#4ECDC4] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#4ECDC4] mb-4">Add Custom Class</h2>
            <input
              type="text"
              value={customClassName}
              onChange={(e) => setCustomClassName(e.target.value)}
              placeholder="Class name..."
              className="w-full p-3 rounded-lg bg-[#0f2818] border border-[#4ECDC4] text-white placeholder-gray-500 focus:outline-none focus:border-[#45B7AA] mb-3"
            />
            <textarea
              value={customClassDesc}
              onChange={(e) => setCustomClassDesc(e.target.value)}
              placeholder="Class description..."
              className="w-full h-24 p-3 rounded-lg bg-[#0f2818] border border-[#4ECDC4] text-white placeholder-gray-500 focus:outline-none focus:border-[#45B7AA] mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={addCustomClass}
                className="flex-1 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] hover:from-[#45B7AA] hover:to-[#4ECDC4] text-[#0f2818] font-bold py-2 rounded-lg"
              >
                Add
              </Button>
              <Button
                onClick={() => setShowCustomClassModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Layout Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#4ECDC4] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#4ECDC4] mb-4">Save Layout</h2>
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Layout name..."
              className="w-full p-3 rounded-lg bg-[#0f2818] border border-[#4ECDC4] text-white placeholder-gray-500 focus:outline-none focus:border-[#45B7AA] mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={saveLayout}
                className="flex-1 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] hover:from-[#45B7AA] hover:to-[#4ECDC4] text-[#0f2818] font-bold py-2 rounded-lg"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Load Layout Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#2a6b5f] to-[#1a4d3e] border-2 border-[#4ECDC4] rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#4ECDC4] mb-4">Load Layout</h2>
            {savedLayouts.length === 0 ? (
              <p className="text-gray-400 mb-4">No saved layouts yet</p>
            ) : (
              <div className="space-y-2 mb-4">
                {savedLayouts.map((layout) => (
                  <div
                    key={layout.id}
                    className="p-3 rounded-lg bg-[#0f2818] border border-[#4ECDC4] flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-[#4ECDC4]">{layout.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(layout.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => loadLayout(layout)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Load
                      </Button>
                      <Button
                        onClick={() => deleteLayout(layout.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => setShowLoadModal(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
