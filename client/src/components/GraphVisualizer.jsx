import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphVisualizer({ data, type = 'team' }) {
  const graphContainerRef = useRef(null);
  const [graphWidth, setGraphWidth] = useState(0);
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
            color: '#c9dfd8', // teal-100
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
              color: '#edd3b3', // amber-100
              val: 6
            });
          }
          links.push({ source: candNodeId, target: skillNodeId, label: 'KNOWS' });
        });
      });
    }

    return { nodes: Array.from(nodesMap.values()), links };
  }, [data, type]);

  useEffect(() => {
    const container = graphContainerRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setGraphWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  if (!graphData.nodes.length) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-ink)] bg-[var(--color-ink)] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-white">Interactive knowledge graph</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-white/70">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#c9dfd8' }}></span> Candidate
          </span>
          <span className="flex items-center gap-1.5 font-medium text-white/70">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#edd3b3' }}></span> Skill
          </span>
        </div>
      </div>

      <div ref={graphContainerRef} className="flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20">
        {graphWidth > 0 && (
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
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillStyle = '#f8fafc';
              ctx.fillText(label, node.x, node.y + node.val + 2);
            }}
            width={graphWidth}
            height={320}
          />
        )}
      </div>
    </div>
  );
}
