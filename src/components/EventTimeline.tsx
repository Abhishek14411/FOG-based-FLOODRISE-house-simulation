import type { DemoEvent } from '../types/simulation';

interface EventTimelineProps {
  events: DemoEvent[];
  currentTime: number;
}

export function EventTimeline({ events }: EventTimelineProps) {
  const displayEvents = events.slice(-12);

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
        marginBottom: '6px',
        paddingBottom: '4px',
        borderBottom: '1px solid #1f2937'
      }}>
        ⏱ System Event Log
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {displayEvents.length === 0 && (
          <div style={{ color: '#4b5563', fontSize: '11px', textAlign: 'center', margin: 'auto' }}>
            No events recorded yet. Click ▶ START or 🎬 PLAY AUTO DEMO to begin.
          </div>
        )}
        {displayEvents.map((ev, i) => {
          const borderColor = ev.phase === 0 ? '#6b7280' : ev.phase <= 3 ? '#3b82f6' : ev.phase <= 6 ? '#f59e0b' : '#10b981';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                borderLeft: `3px solid ${borderColor}`,
                background: '#111827'
              }}
            >
              <span style={{ fontFamily: 'monospace', color: '#6b7280', flexShrink: 0, fontSize: '10px' }}>
                [{ev.time.toFixed(1)}s]
              </span>
              <span style={{ fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>
                {ev.label}:
              </span>
              <span style={{ color: '#d1d5db' }}>
                {ev.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
