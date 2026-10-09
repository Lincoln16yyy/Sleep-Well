import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { buildDailySeries } from '../lib/dashboard';

/**
 * Gráfico de barras das horas dormidas por dia com a linha da meta.
 * Carregado com React.lazy para não pesar no bundle inicial (Recharts é pesado).
 */
export default function SleepChart({ summary, days, goalHours }) {
  return (
    <div
      role="img"
      aria-label={`Gráfico de barras das horas dormidas nos últimos ${days} dias, com a meta de ${goalHours} horas`}
      style={{ width: '100%', height: '220px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buildDailySeries(summary, days)} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={days > 7 ? 3 : 0} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 'auto']} width={45} />
          <Tooltip formatter={(value) => [`${value} h`, 'Dormido']} />
          <ReferenceLine
            y={goalHours}
            stroke="#E5484D"
            strokeDasharray="5 4"
            label={{ value: `Meta ${goalHours}h`, position: 'insideTopRight', fontSize: 11, fill: 'var(--color-erro-texto)' }}
          />
          <Bar dataKey="hours" fill="#15142E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
