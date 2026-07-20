import Image from "next/image";
import type { ProjectIntent } from "@/domain/types";

const INTENT_IMAGES: Record<
  ProjectIntent,
  { src: string; alt: string }
> = {
  privacy: {
    src: "/intents/privacy.webp",
    alt: "Tall wood privacy fence around a backyard",
  },
  pets: {
    src: "/intents/pets.webp",
    alt: "Enclosed yard with a wood walk gate",
  },
  replace: {
    src: "/intents/replace.webp",
    alt: "New fence panels replacing an older run",
  },
  boundary: {
    src: "/intents/boundary.webp",
    alt: "Chain-link fence along a property boundary",
  },
  gate_area: {
    src: "/intents/gate-area.webp",
    alt: "Wood fence with a wide double gate",
  },
  pool_garden: {
    src: "/intents/pool-garden.webp",
    alt: "Pool enclosure with a wood privacy fence",
  },
  modern: {
    src: "/intents/modern.webp",
    alt: "Modern horizontal charcoal wood fence",
  },
  calculate: {
    src: "/intents/calculate.webp",
    alt: "Fence posts, panels, and materials ready to count",
  },
};

/** Photorealistic yard scenes for onboarding intent cards. */
export function IntentIllustration({ intent }: { intent: ProjectIntent }) {
  const image = INTENT_IMAGES[intent];

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={480}
      height={288}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  );
}
