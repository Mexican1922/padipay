import { C, TYPO } from "../styles/tokens";
import { Icon } from "./Icons";

type Brand = string;

interface Props {
  brand: Brand;
  size?: number;
}

export const isKnownBrand = (brand: string) => {
  if (!brand) return false;
  const b = brand.toLowerCase();
  const known = [
    "mtn", "airtel", "glo", "9mobile",
    "dstv", "gotv", "startimes",
    "spectranet", "smile", "swift",
    "electric",
    "bet9ja", "sportybet", "1xbet", "betking"
  ];
  return known.some(k => b.includes(k));
};

export default function BrandLogo({ brand, size = 40 }: Props) {
  const b = brand.toLowerCase();

  // Helper to generate a standardized circle badge
  const Badge = ({ bg, color, text, children }: { bg: string; color: string; text?: string; children?: React.ReactNode }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        border: `1px solid ${C.outlineVar}`,
      }}
    >
      {children || (
        <span
          style={{
            fontFamily: TYPO.display.fontFamily,
            fontWeight: 800,
            fontSize: size * 0.35,
            letterSpacing: -0.5,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );

  // Telecoms
  if (b.includes("mtn")) return <Badge bg="#FFCC00" color="#000000" text="MTN" />;
  if (b.includes("airtel")) return <Badge bg="#FF0000" color="#FFFFFF" text="airtel" />;
  if (b.includes("glo")) return <Badge bg="#00985F" color="#FFFFFF" text="glo" />;
  if (b.includes("9mobile")) return <Badge bg="#006600" color="#FFFFFF" text="9m" />;

  // TV / Cable
  if (b.includes("dstv")) return <Badge bg="#0073C6" color="#FFFFFF" text="DStv" />;
  if (b.includes("gotv")) return <Badge bg="#FFCC00" color="#000000" text="GOtv" />;
  if (b.includes("startimes")) return <Badge bg="#FF6600" color="#FFFFFF" text="Star" />;

  // Internet
  if (b.includes("spectranet")) return <Badge bg="#E3000F" color="#FFFFFF" text="SPEC" />;
  if (b.includes("smile")) return <Badge bg="#FFCC00" color="#000000" text="Smile" />;
  if (b.includes("swift")) return <Badge bg="#FF0000" color="#FFFFFF" text="SWIFT" />;

  // Electricity
  if (b.includes("electric")) {
    let bg = "#F59E0B";
    if (b.includes("ikeja")) bg = "#EF4444";
    if (b.includes("eko")) bg = "#10B981";
    if (b.includes("abuja")) bg = "#3B82F6";
    
    return (
      <Badge bg={bg} color="#FFFFFF">
        <Icon.Lightning size={size * 0.5} color="#FFFFFF" />
      </Badge>
    );
  }

  // Betting
  if (b.includes("bet9ja")) return <Badge bg="#1C2025" color="#279D57" text="9JA" />;
  if (b.includes("sportybet")) return <Badge bg="#CF0100" color="#FFFFFF" text="Sporty" />;
  if (b.includes("1xbet")) return <Badge bg="#1876D2" color="#FFFFFF" text="1x" />;
  if (b.includes("betking")) return <Badge bg="#FFD700" color="#00004D" text="King" />;

  // Fallback for unknown brands
  return (
    <Badge bg={C.surface2} color={C.onSurfaceDim}>
      {brand.slice(0, 2).toUpperCase()}
    </Badge>
  );
}
