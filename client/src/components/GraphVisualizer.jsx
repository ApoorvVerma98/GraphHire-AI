import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphVisualizer({ data, type = 'team' }) {
  const graphData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return { nodes: [], links: [] };

    const nodesMap = new Map();
    const links = [];

    if (type === 'team') {
      data.data.slice(0, 5).forEach((cand) => {
        const candNodeId = `c_${cand.id}`;
        if (!nodesMap.has(candNodeId)) {
          nodesMap.set(candNodeId, { 
            id: candNodeId, 
            name: cand.name, 
            group: 'Candidate', 
            color: '#6366f1', // Indigo
            val: 8 
          });
        }

        cand.matchingSkills.forEach((skillName) => {
          const skillNodeId = `s_${skillName}`;
          if (!nodesMap.has(skillNodeId)) {
            nodesMap.set(skillNodeId, { 
              id: skillNodeId, 
              name: skillName, 
              group: 'Skill', 
              color: '#10b981', // Emerald
              val: 6 
            });
          }
          links.push({ source: candNodeId, target: skillNodeId, label: 'KNOWS' });
        });
      });
    }

    return { nodes: Array.from(nodesMap.values()), links };
  }, [data, type]);

  if (!graphData.nodes.length) return null;

  return (
    <div className="mt-6 border border-slate-800 bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-xl">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          🕸️ Interactive Knowledge Graph
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-indigo-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Candidate
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Skill
          </span>
        </div>
      </div>

      <div className="h-72 w-full rounded-xl overflow-hidden bg-slate-950 flex justify-center items-center border border-slate-800/80">
        <ForceGraph2D
          graphData={graphData}
          nodeVal={(node) => node.val}
          nodeColor={(node) => node.color}
          linkColor={() => '#475569'}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={2}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;

            // Draw Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Draw Text Label Below Node
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#f8fafc';
            ctx.fillText(label, node.x, node.y + node.val + 2);
          }}
          width={650}
          height={280}
        />
      </div>
    </div>
  );
}