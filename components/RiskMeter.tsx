import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { RiskLevel } from '../types';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, level }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case RiskLevel.SAFE: return '#10b981'; // emerald-500
      case RiskLevel.SUSPICIOUS: return '#f59e0b'; // amber-500
      case RiskLevel.MALICIOUS: return '#ef4444'; // red-500
      default: return '#94a3b8'; // slate-400
    }
  };

  const activeColor = getColor(level);

  return (
    <div className="h-48 w-full flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="score" fill={activeColor} />
            <Cell key="remaining" fill="#1e293b" /> 
            <Label
              value={`${score}/100`}
              position="center"
              fill={activeColor}
              className="text-2xl font-bold font-mono"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-4 text-center">
        <span className="text-sm text-slate-400 uppercase tracking-wider">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskMeter;