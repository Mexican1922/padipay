import { C, TYPO, TRANSITIONS } from "../styles/tokens";

export type FilterOption = "All" | "Sent" | "Received" | "Funded";

interface Props {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
}

const OPTIONS: FilterOption[] = ["All", "Sent", "Received", "Funded"];

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Filter transactions"
      style={{
        padding: "14px 20px 12px",
        display: "flex",
        gap: 10,
        overflowX: "auto",
        flexShrink: 0,
        // Hide scrollbar but keep functionality
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE
      }}
      className="hide-scroll"
    >
      <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>

      {OPTIONS.map((option) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className="focus-ring anim-press-bounce"
            style={{
              background: isActive ? C.goldGlowStrong : C.surface2,
              border: `1px solid ${isActive ? C.goldBorder : C.outlineVar}`,
              color: isActive ? C.gold : C.onSurfaceMuted,
              borderRadius: 100, // Pill shape
              padding: "8px 18px",
              ...TYPO.bodyMedium,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: TRANSITIONS.normal,
              boxShadow: isActive ? `0 0 16px ${C.goldGlow}` : "none",
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
