import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Heart, Share2, Copy, Loader } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface CommunityLayout {
  id: number;
  name: string;
  description: string;
  teamData: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  runId: number;
  userId: number;
  isLiked?: boolean;
  creatorUsername?: string;
  creatorPrivateServer?: string;
}

interface CommunityPageProps {
  onClose: () => void;
}

export default function CommunityPage({ onClose }: CommunityPageProps) {
  const [layouts, setLayouts] = useState<CommunityLayout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<CommunityLayout | null>(null);

  const communityQuery = trpc.community.list.useQuery({ limit: 50, offset: 0 });
  const likeMutation = trpc.community.like.useMutation();

  useEffect(() => {
    if (communityQuery.data && Array.isArray(communityQuery.data)) {
      const layoutsWithCreator = communityQuery.data.map((layout: any) => ({
        ...layout,
        createdAt: new Date(layout.createdAt),
        updatedAt: new Date(layout.updatedAt),
      }));
      setLayouts(layoutsWithCreator);
    }
  }, [communityQuery.data]);

  const handleLike = async (layoutId: number) => {
    try {
      await likeMutation.mutateAsync({ layoutId });
      setLayouts(prev =>
        prev.map(layout =>
          layout.id === layoutId
            ? { ...layout, likes: layout.likes + 1, isLiked: true }
            : layout
        )
      );
      toast.success("Liked!");
    } catch (error) {
      toast.error("Failed to like layout");
    }
  };

  const handleCopyTeam = (teamData: string) => {
    navigator.clipboard.writeText(teamData);
    toast.success("Team copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FF00] rounded-lg shadow-2xl shadow-[#00FF00]/50 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#00FF00]">🌍 Community Layouts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#00FF00]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {communityQuery.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader size={32} className="text-[#00FF00] animate-spin" />
            </div>
          ) : layouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No community layouts yet.</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to share your team!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {layouts.map((layout) => (
                <div
                  key={layout.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-[#0f001a] to-[#1a0033] border border-[#00FF00]/30 hover:border-[#00FF00] transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#FF1493]">{layout.name}</h3>
                      <p className="text-xs text-gray-400">by {layout.creatorUsername || "Unknown"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(layout.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FF1493]/20 hover:bg-[#FF1493]/40 text-[#FF1493] text-xs font-semibold transition-colors"
                      >
                        <Heart size={14} fill={layout.isLiked ? "currentColor" : "none"} />
                        {layout.likes}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{layout.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyTeam(layout.teamData)}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#00FF00]/20 hover:bg-[#00FF00]/40 text-[#00FF00] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Copy size={14} /> Copy Team
                    </button>
                    <button
                      onClick={() => setSelectedLayout(layout)}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#00FFFF]/20 hover:bg-[#00FFFF]/40 text-[#00FFFF] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 size={14} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2D0A4E]">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#00FF00] to-[#00FFFF] hover:from-[#00FFFF] hover:to-[#00FF00] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FF00]/50 transition-all hover:shadow-[#00FF00]/70 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLayout && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLayout(null)}
        >
          <div
            className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] rounded-lg shadow-2xl shadow-[#00FFFF]/50 max-w-md w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#FF1493]">{selectedLayout.name}</h3>
              <button
                onClick={() => setSelectedLayout(null)}
                className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
              >
                <X size={20} className="text-[#FF1493]" />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-4 overflow-y-auto">
              <div>
                <p className="text-xs text-gray-400 mb-1">Roblox Username</p>
                <p className="text-[#00FFFF] font-semibold">{selectedLayout.creatorUsername || "Unknown"}</p>
              </div>

              {selectedLayout.creatorPrivateServer && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Private Server Link</p>
                  <a
                    href={selectedLayout.creatorPrivateServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00FF00] hover:underline font-mono text-xs break-all"
                  >
                    {selectedLayout.creatorPrivateServer}
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-gray-300">{selectedLayout.description}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Likes</p>
                <p className="text-[#FF1493] font-bold text-lg">{selectedLayout.likes} ❤️</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Team Composition</p>
                <div className="bg-[#0f001a] border border-[#2D0A4E] rounded p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                    {selectedLayout.teamData}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
              <Button
                onClick={() => setSelectedLayout(null)}
                className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleCopyTeam(selectedLayout.teamData);
                  setSelectedLayout(null);
                }}
                className="flex-1 bg-gradient-to-r from-[#00FF00] to-[#00FFFF] hover:from-[#00FFFF] hover:to-[#00FF00] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FF00]/50 transition-all hover:shadow-[#00FF00]/70 cursor-pointer"
              >
                Copy Team
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
