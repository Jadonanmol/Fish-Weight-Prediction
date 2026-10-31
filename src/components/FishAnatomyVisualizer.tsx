import React from 'react';
import { Morphometrics } from '../types/fish';

interface FishAnatomyVisualizerProps {
  morphometrics: Morphometrics;
}

export const FishAnatomyVisualizer: React.FC<FishAnatomyVisualizerProps> = ({
  morphometrics,
}) => {
  const { species, length1, length2, length3, height, width } = morphometrics;

  // Scale normalized coordinates based on dimensions
  // Length3 is the longest length (max ~ 70 cm), Height is ~ 20 cm
  const l3Clamped = Math.max(10, Math.min(65, length3));
  const l2Clamped = Math.max(8, Math.min(l3Clamped - 1, length2));
  const l1Clamped = Math.max(6, Math.min(l2Clamped - 1, length1));
  const hClamped = Math.max(2, Math.min(22, height));

  // Canvas bounds
  const svgWidth = 640;
  const svgHeight = 280;
  const originX = 70;
  const centerY = 135;

  // Scaling factors to fit SVG viewport
  const scaleX = 7.0; // px per cm
  const scaleY = 5.2; // px per cm

  const snoutX = originX;
  const l1X = originX + l1Clamped * scaleX;
  const l2X = originX + l2Clamped * scaleX;
  const l3X = originX + l3Clamped * scaleX;

  const halfH = (hClamped * scaleY) / 2;
  const topY = centerY - halfH;
  const botY = centerY + halfH;

  // Body path construction
  const dorsalPeakX = originX + (l1Clamped * scaleX) * 0.38;
  const pelvicLowX = originX + (l1Clamped * scaleX) * 0.42;

  // Tail fin tip coordinates
  const tailForkY = centerY;
  const tailTopY = centerY - halfH * 1.05;
  const tailBotY = centerY + halfH * 1.05;

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Morphometric Anatomy & Dimension Mapping
          </h3>
          <p className="text-[11px] text-slate-400">
            Dynamic SVG silhouette scaling in real time with input parameters
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
          <span>Lengths</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block ml-2"></span>
          <span>Height / Width</span>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-64"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern
              id="grid-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.5"
                strokeOpacity="0.4"
              />
            </pattern>
            <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <rect width={svgWidth} height={svgHeight} fill="url(#grid-pattern)" />

          {/* Reference Center Baseline */}
          <line
            x1="50"
            y1={centerY}
            x2={svgWidth - 40}
            y2={centerY}
            stroke="#334155"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Fish Body Silhouette */}
          <path
            d={`
              M ${snoutX} ${centerY}
              C ${snoutX + 25} ${topY + 10}, ${dorsalPeakX - 20} ${topY}, ${dorsalPeakX} ${topY}
              C ${dorsalPeakX + 40} ${topY}, ${l1X - 30} ${centerY - halfH * 0.4}, ${l1X} ${centerY - 12}
              L ${l3X} ${tailTopY}
              L ${l2X} ${tailForkY}
              L ${l3X} ${tailBotY}
              L ${l1X} ${centerY + 12}
              C ${l1X - 30} ${centerY + halfH * 0.4}, ${pelvicLowX + 30} ${botY}, ${pelvicLowX} ${botY}
              C ${pelvicLowX - 25} ${botY}, ${snoutX + 25} ${botY - 10}, ${snoutX} ${centerY}
              Z
            `}
            fill="url(#fishGradient)"
            stroke="#38bdf8"
            strokeWidth="1.5"
            className="transition-all duration-150 ease-out"
          />

          {/* Eye */}
          <circle
            cx={snoutX + 32}
            cy={centerY - halfH * 0.25}
            r="4.5"
            fill="#0f172a"
            stroke="#e0f2fe"
            strokeWidth="1.2"
          />
          <circle
            cx={snoutX + 33}
            cy={centerY - halfH * 0.25 - 1}
            r="1.2"
            fill="#ffffff"
          />

          {/* Pectoral Fin hint */}
          <path
            d={`M ${snoutX + 55} ${centerY + 2} Q ${snoutX + 85} ${centerY + 18} ${snoutX + 80} ${centerY + 3} Z`}
            fill="#0284c7"
            fillOpacity="0.6"
            stroke="#38bdf8"
            strokeWidth="1"
          />

          {/* Dorsal Fin */}
          <path
            d={`M ${dorsalPeakX - 25} ${topY + 2} Q ${dorsalPeakX + 15} ${topY - 24} ${dorsalPeakX + 55} ${topY + 6} Z`}
            fill="#0369a1"
            fillOpacity="0.4"
            stroke="#38bdf8"
            strokeWidth="1"
          />

          {/* Measurement Annotations */}
          {/* L1: Vertical Length (Snout to caudal peduncle) */}
          <g className="text-cyan-400">
            <line
              x1={snoutX}
              y1={svgHeight - 65}
              x2={l1X}
              y2={svgHeight - 65}
              stroke="#06b6d4"
              strokeWidth="1.5"
            />
            <line x1={snoutX} y1={centerY + 5} x2={snoutX} y2={svgHeight - 60} stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1" />
            <line x1={l1X} y1={centerY + 15} x2={l1X} y2={svgHeight - 60} stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1" />
            <circle cx={snoutX} cy={svgHeight - 65} r="2.5" fill="#06b6d4" />
            <circle cx={l1X} cy={svgHeight - 65} r="2.5" fill="#06b6d4" />
            <text
              x={(snoutX + l1X) / 2}
              y={svgHeight - 70}
              fill="#06b6d4"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              L₁ (Vertical): {length1} cm
            </text>
          </g>

          {/* L2: Diagonal Length (Snout to tail notch) */}
          <g className="text-cyan-300">
            <line
              x1={snoutX}
              y1={svgHeight - 45}
              x2={l2X}
              y2={svgHeight - 45}
              stroke="#22d3ee"
              strokeWidth="1.5"
            />
            <line x1={l2X} y1={tailForkY} x2={l2X} y2={svgHeight - 40} stroke="#22d3ee" strokeDasharray="2 2" strokeWidth="1" />
            <circle cx={snoutX} cy={svgHeight - 45} r="2.5" fill="#22d3ee" />
            <circle cx={l2X} cy={svgHeight - 45} r="2.5" fill="#22d3ee" />
            <text
              x={(snoutX + l2X) / 2}
              y={svgHeight - 50}
              fill="#22d3ee"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              L₂ (Diagonal): {length2} cm
            </text>
          </g>

          {/* L3: Cross Length (Snout to fin tip) */}
          <g className="text-sky-300">
            <line
              x1={snoutX}
              y1={svgHeight - 25}
              x2={l3X}
              y2={svgHeight - 25}
              stroke="#7dd3fc"
              strokeWidth="1.5"
            />
            <line x1={l3X} y1={tailBotY} x2={l3X} y2={svgHeight - 20} stroke="#7dd3fc" strokeDasharray="2 2" strokeWidth="1" />
            <circle cx={snoutX} cy={svgHeight - 25} r="2.5" fill="#7dd3fc" />
            <circle cx={l3X} cy={svgHeight - 25} r="2.5" fill="#7dd3fc" />
            <text
              x={(snoutX + l3X) / 2}
              y={svgHeight - 30}
              fill="#7dd3fc"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              L₃ (Cross / Total): {length3} cm
            </text>
          </g>

          {/* Height Dimension Line */}
          <g className="text-emerald-400">
            <line
              x1={dorsalPeakX}
              y1={topY}
              x2={dorsalPeakX}
              y2={botY}
              stroke="#10b981"
              strokeWidth="1.8"
            />
            <circle cx={dorsalPeakX} cy={topY} r="2.5" fill="#10b981" />
            <circle cx={dorsalPeakX} cy={botY} r="2.5" fill="#10b981" />
            <rect
              x={dorsalPeakX + 6}
              y={centerY - 9}
              width="95"
              height="18"
              rx="3"
              fill="#064e3b"
              fillOpacity="0.8"
              stroke="#10b981"
              strokeWidth="0.8"
            />
            <text
              x={dorsalPeakX + 10}
              y={centerY + 4}
              fill="#a7f3d0"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              H: {height} cm
            </text>
          </g>

          {/* Lateral Width Indicator in Top Corner */}
          <g transform="translate(510, 20)">
            <rect
              x="0"
              y="0"
              width="110"
              height="45"
              rx="6"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="10" y="16" fill="#94a3b8" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
              BODY WIDTH (W)
            </text>
            <text x="10" y="34" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">
              {width} cm
            </text>
            {/* Ellipse representation of width vs height cross-section */}
            <ellipse
              cx="90"
              cy="25"
              rx={Math.min(16, Math.max(3, (width * 1.8)))}
              ry="14"
              fill="#0284c7"
              fillOpacity="0.4"
              stroke="#38bdf8"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono px-1">
        <span>Species: <strong className="text-slate-200">{species}</strong></span>
        <span>Ratio L₃/H: <strong className="text-slate-200">{(length3 / (height || 1)).toFixed(2)}</strong></span>
        <span>Ratio H/W: <strong className="text-slate-200">{(height / (width || 1)).toFixed(2)}</strong></span>
      </div>
    </div>
  );
};
