import Image from "next/image";

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src="/brand/chicas-en-ia-logo.png"
        alt="Chicas en IA — creando un futuro sostenible"
        width={compact ? 160 : 220}
        height={compact ? 39 : 54}
        priority
      />
      <div className="flex items-center gap-2">
        <Image src="/brand/xstem-logo.svg" alt="XSTEM" width={56} height={18} unoptimized />
        <p className="text-xs text-foreground/60">
          + <span className="font-semibold">IBM SkillsBuild</span>
        </p>
      </div>
    </div>
  );
}
