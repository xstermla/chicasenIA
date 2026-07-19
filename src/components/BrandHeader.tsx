import Image from "next/image";

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        src="/brand/chicas-en-ia-logo.png"
        alt="Chicas en IA — creando un futuro sostenible"
        width={compact ? 220 : 300}
        height={compact ? 54 : 74}
        priority
      />
      <div className="flex items-center gap-3">
        <Image
          src="/brand/xstem-logo.svg"
          alt="XSTEM"
          width={compact ? 64 : 84}
          height={compact ? 20 : 27}
          unoptimized
        />
        <p className="text-sm text-foreground/60">
          + <span className="font-semibold">IBM SkillsBuild</span>
        </p>
      </div>
    </div>
  );
}
