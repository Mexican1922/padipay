import { C, FONTS, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import { Icon } from "./Icons";

interface Props {
  amount: number;
  percentChange: number;
  /** Last 7 days of spending data for the sparkline */
  dailySpend?: number[];
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const width = 80;
  const height = 28;
  const padding = 2;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * usableW;
    const y = padding + usableH - (val / max) * usableH;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${padding + usableW},${padding + usableH} L ${padding},${padding + usableH} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkFill)" />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={padding + usableW}
          cy={padding + usableH - (data[data.length - 1] / max) * usableH}
          r={2.5}
          fill={color}
        />
      )}
    </svg>
  );
}

export default function SpendInsight({ amount, percentChange, dailySpend }: Props) {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

  const isDown = percentChange < 0;
  const trendColor = isDown ? C.mint : C.error;

  // Generate mock daily data if not provided (based on amount)
  const sparkData = dailySpend || [
    amount * 0.08,
    amount * 0.15,
    amount * 0.12,
    amount * 0.22,
    amount * 0.18,
    amount * 0.1,
    amount * 0.15,
  ];

  return (
    <div
      className={ANIM.fadeInUp}
      style={{
        "--delay": "180ms",
        margin: "16px 20px 0",
        background: C.surface1,
        border: `1px solid ${C.outlineVar}`,
        borderLeft: `3px solid ${trendColor}`,
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        transition: TRANSITIONS.normal,
      } as React.CSSProperties}
    >
      {/* Left side — icon + text */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <Icon.Activity size={16} color={trendColor} />
        <span
          style={{ ...TYPO.caption, color: C.onSurfaceDim, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          Spent{" "}
          <strong style={{ color: C.onSurface, fontWeight: 600 }}>
            {formatted}
          </strong>{" "}
          this week
        </span>
      </div>

      {/* Sparkline chart */}
      <Sparkline data={sparkData} color={trendColor} />

      {/* Badge */}
      <span
        style={{
          background: isDown ? C.mintGlow : C.errorBg,
          color: trendColor,
          border: `1px solid ${isDown ? C.mintBorder : C.errorBorder}`,
          fontSize: 11,
          padding: "4px 10px",
          borderRadius: 20,
          fontWeight: 600,
          fontFamily: FONTS.body,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {isDown ? "↓" : "↑"} {Math.abs(percentChange)}%
      </span>
    </div>
  );
}
