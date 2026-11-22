import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HistoryPoint } from '../types/simulation';

interface FloodChartProps {
  history: HistoryPoint[];
}

export function FloodChart({ history }: FloodChartProps) {
  const display = history.length > 100 ? history.slice(history.length - 100) : history;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#1a2537',
      border: '1px solid #1f2937',
      borderRadius: '8px',
      padding: '8px 12px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        color: '#60a5fa',
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '4px',
        paddingBottom: '4px',
        borderBottom: '1px solid #1f2937'
      }}>
        📈 Live Sensor Telemetry Graph
      </div>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={display} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23354d" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}s`}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} domain={[0, 2.5]} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '6px', fontSize: '11px' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#9ca3af', paddingTop: '2px' }} />
            <Line type="monotone" dataKey="floodDepth" name="Flood Depth (m)" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line type="monotone" dataKey="platformElevation" name="House Elevation (m)" stroke="#22c55e" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line type="monotone" dataKey="pistonExtension" name="Piston (m)" stroke="#f59e0b" dot={false} strokeWidth={1.5} strokeDasharray="4 2" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
