import React from "react";

interface TeamStats {
  totalToons: number;
  totalTrinkets: number;
  trinketCounts: Record<string, number>;
  uniqueTrinkets: number;
  teamComposition: string;
}

interface TeamStatsProps {
  team: any;
  trinketNames: Record<string, string>;
}

export const TeamStatsPanel: React.FC<TeamStatsProps> = ({ team, trinketNames }) => {
  const calculateStats = (): TeamStats => {
    const totalToons = Object.values(team.toons).reduce((sum: number, count: any) => sum + (count || 0), 0);
    const trinketCounts = team.trinkets.reduce((acc: Record<string, number>, id: string) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    const uniqueTrinkets = Object.keys(trinketCounts).length;
    const totalTrinkets = team.trinkets.length;

    return {
      totalToons,
      totalTrinkets,
      trinketCounts,
      uniqueTrinkets,
      teamComposition: `${totalToons} Toons, ${uniqueTrinkets} Unique Trinkets`,
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-br from-[#1a0033] to-[#0f001a] border-2 border-[#FF1493] rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-bold text-[#FF1493]">Team Statistics</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-[#0f001a] rounded">
          <span className="text-[#00FFFF]">Total Toons:</span>
          <span className="text-[#00FF00] font-bold">{stats.totalToons}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-[#0f001a] rounded">
          <span className="text-[#00FFFF]">Total Trinkets:</span>
          <span className="text-[#00FF00] font-bold">{stats.totalTrinkets}</span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-[#0f001a] rounded">
          <span className="text-[#00FFFF]">Unique Trinkets:</span>
          <span className="text-[#00FF00] font-bold">{stats.uniqueTrinkets}</span>
        </div>
        
        <div className="p-2 bg-[#0f001a] rounded">
          <p className="text-[#00FFFF] text-sm">Team Composition:</p>
          <p className="text-[#FFC75F] font-semibold text-sm">{stats.teamComposition}</p>
        </div>
      </div>

      {stats.totalTrinkets > 0 && (
        <div className="p-2 bg-[#0f001a] rounded">
          <p className="text-[#00FFFF] text-sm mb-2">Trinket Breakdown:</p>
          <div className="space-y-1">
            {Object.entries(stats.trinketCounts).map(([trinketId, count]) => (
              <div key={trinketId} className="flex justify-between text-xs">
                <span className="text-[#00FFFF]">{trinketNames[trinketId] || trinketId}:</span>
                <span className="text-[#FFC75F]">×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
