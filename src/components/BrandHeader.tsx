import Image from "next/image";

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Image
        src="/brand/xstem-logo.svg"
        alt="XSTEM"
        width={compact ? 52 : 64}
        height={compact ? 17 : 20}
        unoptimized
        className="shrink-0"
      />
      <Image
        src="/brand/chicas-en-ia-logo.png"
        alt="Chicas en IA — creando un futuro sostenible"
        width={compact ? 140 : 180}
        height={compact ? 34 : 44}
        priority
        className="shrink-0"
      />
      <p className="max-w-[6.5rem] text-right text-[0.65rem] leading-tight text-foreground/60">
        En colaboración con <span className="font-semibold">IBM SkillsBuild</span>
      </p>
    </div>
  );
}
