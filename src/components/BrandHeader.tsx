import Image from "next/image";

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-4">
        <Image
          src="/brand/chicas-en-ia-logo.png"
          alt="Chicas en IA — creando un futuro sostenible"
          width={compact ? 150 : 190}
          height={compact ? 37 : 47}
          priority
        />
        <Image
          src="/brand/xstem-logo.svg"
          alt="XSTEM"
          width={compact ? 60 : 74}
          height={compact ? 19 : 24}
          unoptimized
        />
      </div>
      <p className="text-center text-xs text-foreground/60">
        En colaboración con <span className="font-semibold">IBM SkillsBuild</span>
      </p>
    </div>
  );
}
