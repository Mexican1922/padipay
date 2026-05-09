import { C, SHADOWS } from "../styles/tokens";
import AppLayout from "./AppLayout";
import BottomNav from "./BottomNav";

/* ── Primitive skeleton shapes ── */

function Box({
  w,
  h,
  r = 8,
  style,
}: {
  w: number | string;
  h: number;
  r?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="skeleton"
      style={{
        width: w,
        height: h,
        borderRadius: r,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Circle({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton-circle"
      style={{ width: size, height: size, flexShrink: 0, ...style }}
    />
  );
}

/* ── Home skeleton ── */

export function HomeSkeleton() {
  return (
    <AppLayout showNav={false}>
      {/* Header area */}
      <div
        style={{
          background: C.surface0,
          padding: "16px 24px 24px",
          boxShadow: SHADOWS.header,
        }}
      >
        {/* Top bar: avatar + greeting + bell */}
        <div className="safe-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Circle size={40} />
            <div>
              <Box w={60} h={10} r={5} />
              <Box w={90} h={14} r={6} style={{ marginTop: 6 }} />
            </div>
          </div>
          <Circle size={28} />
        </div>

        {/* Balance card skeleton */}
        <div
          style={{
            background: C.surface1,
            borderRadius: 20,
            padding: "22px",
            border: `1px solid ${C.outlineVar}`,
          }}
        >
          <Box w={80} h={10} r={5} />
          <Box w={180} h={32} r={8} style={{ marginTop: 10 }} />
          <div
            style={{
              height: "0.5px",
              background: C.outlineVar,
              margin: "16px 0 14px",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Box w={100} h={12} r={5} />
            <Box w={60} h={16} r={4} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
        {/* Quick actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            padding: "20px 20px 0",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Box w={56} h={56} r={16} />
              <Box w={36} h={8} r={4} />
            </div>
          ))}
        </div>

        {/* Spend insight */}
        <div style={{ margin: "16px 20px 0" }}>
          <Box w="100%" h={48} r={14} />
        </div>

        {/* Recent transactions header */}
        <div
          style={{
            padding: "18px 20px 0",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Box w={140} h={14} r={6} />
          <Box w={45} h={12} r={5} />
        </div>

        {/* Transaction rows */}
        <div style={{ padding: "0 20px" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: i < 3 ? `0.5px solid ${C.outlineFaint}` : "none",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <Box w={44} h={44} r={14} />
              <div style={{ flex: 1 }}>
                <Box w={120} h={12} r={5} />
                <Box w={80} h={9} r={4} style={{ marginTop: 6 }} />
              </div>
              <Box w={70} h={14} r={5} />
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </AppLayout>
  );
}

/* ── Activity skeleton ── */

export function ActivitySkeleton() {
  return (
    <AppLayout>
      {/* Sticky header */}
      <div
        className="safe-top"
        style={{
          background: C.surfaceGlass,
          padding: "16px 20px 0",
          boxShadow: SHADOWS.header,
        }}
      >
        <Box w={80} h={20} r={8} style={{ marginBottom: 12, marginLeft: 4 }} />
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, paddingBottom: 12 }}>
          {[48, 42, 56, 48].map((w, i) => (
            <Box key={i} w={w} h={32} r={20} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
        {/* Day groups */}
        {[0, 1].map((g) => (
          <div key={g}>
            <Box w={60} h={10} r={5} style={{ margin: "24px 0 12px" }} />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: i < 2 ? `0.5px solid ${C.outlineFaint}` : "none",
                }}
              >
                <Box w={44} h={44} r={14} />
                <div style={{ flex: 1 }}>
                  <Box w={110} h={12} r={5} />
                  <Box w={75} h={9} r={4} style={{ marginTop: 6 }} />
                </div>
                <Box w={65} h={14} r={5} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

/* ── Profile skeleton ── */

export function ProfileSkeleton() {
  return (
    <AppLayout>
      {/* Header */}
      <div
        className="safe-top"
        style={{
          background: C.surfaceGlass,
          padding: "16px 24px",
          boxShadow: SHADOWS.header,
        }}
      >
        <Box w={65} h={20} r={8} />
      </div>

      <div style={{ flex: 1, padding: "24px 20px", overflowY: "auto" }}>
        {/* Avatar + name card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            background: C.surface1,
            padding: 20,
            borderRadius: 24,
            border: `1px solid ${C.outlineVar}`,
          }}
        >
          <Circle size={72} />
          <div style={{ flex: 1 }}>
            <Box w={130} h={16} r={6} />
            <Box w={90} h={12} r={5} style={{ marginTop: 6 }} />
            <Box w={150} h={10} r={4} style={{ marginTop: 6 }} />
          </div>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: C.surface1,
                border: `1px solid ${C.outlineVar}`,
                borderRadius: 16,
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Box w={60} h={14} r={5} />
              <Box w={45} h={10} r={4} />
            </div>
          ))}
        </div>

        {/* Settings list */}
        <div
          style={{
            background: C.surface1,
            border: `1px solid ${C.outlineVar}`,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                borderBottom: i < 3 ? `0.5px solid ${C.outlineVar}` : "none",
              }}
            >
              <Box w={36} h={36} r={10} />
              <Box w={120} h={14} r={6} />
            </div>
          ))}
        </div>

        {/* Logout button */}
        <Box w="100%" h={52} r={14} />
      </div>
    </AppLayout>
  );
}
