import type { ProjectIntent } from "@/domain/types";

/** Small stylized yard scenes for onboarding intent cards. */
export function IntentIllustration({ intent }: { intent: ProjectIntent }) {
  switch (intent) {
    case "privacy":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#dceee4" />
          <polygon points="20,70 80,88 140,70 80,52" fill="#6f9b6a" />
          <polygon points="58,34 88,18 108,34 78,50" fill="#d9d0c4" />
          <path
            d="M28 62 L28 40 L80 52 L132 40 L132 62 L80 74 Z"
            fill="#8b5e34"
          />
          <path d="M28 40 L80 52 L132 40" fill="none" stroke="#6e4220" strokeWidth="2" />
        </svg>
      );
    case "pets":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#e8f0e4" />
          <ellipse cx="80" cy="72" rx="54" ry="16" fill="#6f9b6a" />
          <rect x="30" y="38" width="100" height="28" rx="2" fill="#b07a45" />
          <rect x="72" y="46" width="16" height="20" fill="#c47b1a" />
          <circle cx="52" cy="78" r="6" fill="#3a3a3a" />
          <ellipse cx="52" cy="84" rx="8" ry="3" fill="#3a3a3a" />
          <circle cx="118" cy="76" r="5" fill="#1c2420" opacity="0.35" />
        </svg>
      );
    case "replace":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#efe8dc" />
          <polygon points="24,74 90,90 146,68 80,52" fill="#8fa87a" />
          <path
            d="M36 58 L100 70"
            stroke="#a89880"
            strokeWidth="5"
            strokeDasharray="6 4"
            opacity="0.7"
          />
          <path d="M36 50 L100 62 L100 40" stroke="#8b5e34" strokeWidth="6" strokeLinecap="round" />
          <polygon points="110,28 140,40 140,58 110,46" fill="#d9d0c4" />
        </svg>
      );
    case "boundary":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#e4ebe6" />
          <rect x="0" y="60" width="160" height="36" fill="#c4b89a" opacity="0.55" />
          {[20, 44, 68, 92, 116, 140].map((x) => (
            <line
              key={x}
              x1={x}
              y1="42"
              x2={x}
              y2="68"
              stroke="#9aa0a6"
              strokeWidth="3"
            />
          ))}
          <line x1="16" y1="46" x2="144" y2="46" stroke="#9aa0a6" strokeWidth="2" />
          <line
            x1="16"
            y1="54"
            x2="144"
            y2="54"
            stroke="#9aa0a6"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>
      );
    case "gate_area":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#e7f1ec" />
          <polygon points="18,72 80,90 142,72 80,54" fill="#6f9b6a" />
          <path d="M30 58 L70 68 L70 40 L30 32 Z" fill="#b07a45" />
          <path d="M90 68 L130 58 L130 32 L90 40 Z" fill="#b07a45" />
          <path
            d="M70 48 L88 42 L96 56 L78 62 Z"
            fill="#c47b1a"
            transform="rotate(-18 83 52)"
          />
        </svg>
      );
    case "pool_garden":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#dde8ef" />
          <rect x="48" y="36" width="64" height="36" rx="16" fill="#6fa8c4" />
          <rect x="28" y="28" width="104" height="52" fill="none" stroke="#8b5e34" strokeWidth="5" />
          <circle cx="118" cy="70" r="7" fill="#6f9b6a" />
          <rect x="36" y="66" width="14" height="10" fill="#7a9e6a" />
        </svg>
      );
    case "modern":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#e8e4df" />
          <polygon points="20,74 80,88 140,70 80,56" fill="#b8b0a4" />
          <polygon points="60,30 96,16 118,30 82,44" fill="#3d3d3d" />
          <g stroke="#3a3a3a" strokeWidth="2.5">
            <line x1="34" y1="48" x2="126" y2="62" />
            <line x1="34" y1="54" x2="126" y2="68" />
            <line x1="34" y1="60" x2="126" y2="74" />
          </g>
        </svg>
      );
    case "calculate":
      return (
        <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden>
          <rect width="160" height="96" fill="#eef2ef" />
          <rect x="28" y="22" width="104" height="54" rx="6" fill="#fffdf8" stroke="#1f5c45" strokeWidth="2" />
          <text x="40" y="42" fill="#1f5c45" fontSize="11" fontFamily="ui-sans-serif, system-ui">
            Posts 24
          </text>
          <text x="40" y="58" fill="#1f5c45" fontSize="11" fontFamily="ui-sans-serif, system-ui">
            Panels 18
          </text>
          <rect x="100" y="34" width="22" height="22" rx="3" fill="#1f5c45" />
          <path d="M106 45 H116 M111 40 V50" stroke="#fff" strokeWidth="2" />
        </svg>
      );
  }
}
