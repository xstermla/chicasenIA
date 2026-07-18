import Image from "next/image";

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "flex-col text-center"}`}>
      <Image
        src="/brand/xstem-logo.svg"
        alt="XSTEM"
        width={compact ? 84 : 120}
        height={compact ? 27 : 38}
        unoptimized
        priority
      />
      <p className="text-xs text-foreground/60">
        En colaboración con <span className="font-semibold">IBM SkillsBuild</span>
      </p>
    </div>
  );
}
