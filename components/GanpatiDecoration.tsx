import Image from "next/image";

interface GanpatiDecorationProps {
  position: "top" | "bottom";
}

export default function GanpatiDecoration({
  position,
}: GanpatiDecorationProps) {
  return (
    <div
      className={`w-full ${
        position === "top" ? "" : "mt-12"
      }`}
    >
      <Image
        src="/images/ganpati-footer.png"
        alt="Ganpati Decoration"
        width={1920}
        height={120}
        priority
        className={`w-full h-auto ${
          position === "top"
            ? "max-h-16 object-cover"
            : "object-cover"
        }`}
      />
    </div>
  );
}