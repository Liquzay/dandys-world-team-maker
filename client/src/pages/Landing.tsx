import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#2d0052] to-[#0f2818] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/images(4)_31d7f656.jpeg" alt="Game Builder" className="w-10 h-10 rounded-lg" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF1493] to-[#4ECDC4] bg-clip-text text-transparent">
              Game Builder
            </h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FF1493] via-[#4ECDC4] to-[#FFB347] bg-clip-text text-transparent">
              Build Your Dream Team
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Create and optimize teams for your favorite games with our advanced team builder
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <a href="/dandy-world">
              <Button className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FF1493] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#FF1493]/50">
                <Gamepad2 size={20} />
                Play Dandy's World
                <ArrowRight size={20} />
              </Button>
            </a>
            <a href="/animal-hospital">
              <Button className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] hover:from-[#45B7AA] hover:to-[#4ECDC4] text-[#0f2818] font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#4ECDC4]/50">
                <Users size={20} />
                Play Animal Hospital
                <ArrowRight size={20} />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-[#4ECDC4]">Available Games</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dandy's World Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d0052] to-[#1a0033] border-2 border-[#FF1493]/30 hover:border-[#FF1493] transition-all p-8 hover:shadow-2xl hover:shadow-[#FF1493]/30">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF1493]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <img src="/manus-storage/images(4)_31d7f656.jpeg" alt="Dandy's World" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-3xl font-bold text-[#FF1493] mb-2">Dandy's World</h4>
                </div>
                <p className="text-gray-300 mb-6">
                  Build your dream squad from 40 unique Toons and 78 powerful Trinkets. Optimize your team composition with advanced multiplier support and custom configurations.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  <li>✓ 40 Unique Toons</li>
                  <li>✓ 78 Powerful Trinkets</li>
                  <li>✓ Custom Team Names</li>
                  <li>✓ Share to Community</li>
                </ul>
                <a href="/dandy-world">
                  <Button className="w-full bg-gradient-to-r from-[#FF1493] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FF1493] text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                    Start Building
                    <ArrowRight size={16} />
                  </Button>
                </a>
              </div>
            </div>

            {/* Animal Hospital Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2818] to-[#1a4d3e] border-2 border-[#4ECDC4]/30 hover:border-[#4ECDC4] transition-all p-8 hover:shadow-2xl hover:shadow-[#4ECDC4]/30">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4ECDC4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] rounded-lg flex items-center justify-center mb-4">
                    <Users size={32} className="text-[#0f2818]" />
                  </div>
                  <h4 className="text-3xl font-bold text-[#4ECDC4] mb-2">Animal Hospital</h4>
                </div>
                <p className="text-gray-300 mb-6">
                  Assemble your medical team from 10 specialized classes. Coordinate healers, support roles, and defenders to save lives and complete challenging runs.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  <li>✓ 10 Medical Classes</li>
                  <li>✓ Team Coordination</li>
                  <li>✓ At Start Notes</li>
                  <li>✓ Copy to Clipboard</li>
                </ul>
                <a href="/animal-hospital">
                  <Button className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] hover:from-[#45B7AA] hover:to-[#4ECDC4] text-[#0f2818] font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                    Start Building
                    <ArrowRight size={16} />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-[#4ECDC4]">Why Choose Us?</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-[#2d0052] to-[#1a0033] border border-[#FF1493]/20">
              <div className="w-12 h-12 bg-[#FF1493] rounded-lg flex items-center justify-center mb-4">
                <Gamepad2 size={24} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Easy to Use</h4>
              <p className="text-gray-400">Intuitive interface makes team building simple and enjoyable for players of all skill levels.</p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-[#0f2818] to-[#1a4d3e] border border-[#4ECDC4]/20">
              <div className="w-12 h-12 bg-[#4ECDC4] rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-[#0f2818]" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Community Driven</h4>
              <p className="text-gray-400">Share your teams with the community and discover strategies from other players worldwide.</p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-[#2d0052] to-[#1a0033] border border-[#FFB347]/20">
              <div className="w-12 h-12 bg-[#FFB347] rounded-lg flex items-center justify-center mb-4">
                <Gamepad2 size={24} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Always Updated</h4>
              <p className="text-gray-400">Stay current with the latest game changes and new content as it releases.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="mb-4">© 2026 Game Builder. All rights reserved.</p>
          <p className="text-sm">Build your perfect team and dominate the games!</p>
        </div>
      </footer>
    </div>
  );
}
