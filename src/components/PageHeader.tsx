import { useNavigate } from "react-router-dom";
import { C, TYPO, SHADOWS, TRANSITIONS, ZINDEX, ANIM } from "../styles/tokens";
import { Icon } from "./Icons";

interface Props {
  title: string;
  back?: string | number;
}

export default function PageHeader({ title, back = "/" }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={ANIM.fadeIn}
      style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: C.surfaceGlass,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.outlineFaint}`,
        boxShadow: SHADOWS.header,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: ZINDEX.header,
      }}
    >
      <div className="safe-top" style={{ display: "flex", alignItems: "center", width: "100%", gap: 16 }}>
        <button
          onClick={() => typeof back === "number" ? navigate(back as number) : navigate(back as string)}
          aria-label="Go back"
          className="focus-ring anim-press-bounce"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: C.surface2,
            border: `1px solid ${C.outlineVar}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: TRANSITIONS.fast,
          }}
        >
          <Icon.ChevronLeft size={20} color={C.onSurface} />
        </button>
        <h1
          style={{
            ...TYPO.h3,
            color: C.onSurface,
            margin: 0, // Reset margin since it's an h1 now
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
