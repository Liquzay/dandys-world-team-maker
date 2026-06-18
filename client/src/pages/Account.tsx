import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface AccountPageProps {
  onClose: () => void;
}

export default function AccountPage({ onClose }: AccountPageProps) {
  const { user } = useAuth();
  const [robloxUsername, setRobloxUsername] = useState("");
  const [privateServerLink, setPrivateServerLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const profileQuery = trpc.profile.getProfile.useQuery();
  const updateProfileMutation = trpc.profile.updateProfile.useMutation();

  useEffect(() => {
    if (profileQuery.data) {
      setRobloxUsername(profileQuery.data.robloxUsername || "");
      setPrivateServerLink(profileQuery.data.privateServerLink || "");
    }
  }, [profileQuery.data]);

  const handleSave = async () => {
    if (!robloxUsername.trim()) {
      toast.error("Roblox username is required!");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfileMutation.mutateAsync({
        robloxUsername: robloxUsername.trim(),
        privateServerLink: privateServerLink.trim() || undefined,
      });
      toast.success("Profile updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#00FFFF] rounded-lg shadow-2xl shadow-[#00FFFF]/50 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#2D0A4E] flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#FF1493]">Account Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2D0A4E] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#FF1493]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#00FFFF] mb-2">
              Manus Username
            </label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#00FFFF] mb-2">
              Roblox Username <span className="text-[#FF1493]">*</span>
            </label>
            <input
              type="text"
              value={robloxUsername}
              onChange={(e) => setRobloxUsername(e.target.value)}
              placeholder="Your Roblox username"
              className="w-full px-4 py-2 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#00FFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Required for creating runs</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#00FFFF] mb-2">
              Private Server Link <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={privateServerLink}
              onChange={(e) => setPrivateServerLink(e.target.value)}
              placeholder="https://www.roblox.com/games/..."
              className="w-full px-4 py-2 rounded-lg bg-[#0f001a] border border-[#2D0A4E] text-white placeholder-gray-500 focus:border-[#00FFFF] focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Share your private server with the community</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2D0A4E] flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-[#2D0A4E] hover:bg-[#3D1A5E] text-white font-bold px-6 py-2 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-[#00FFFF] to-[#00FF00] hover:from-[#00FF00] hover:to-[#00FFFF] text-[#0f001a] font-bold px-6 py-2 rounded-lg shadow-lg shadow-[#00FFFF]/50 transition-all hover:shadow-[#00FFFF]/70 cursor-pointer flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
