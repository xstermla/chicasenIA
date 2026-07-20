import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 px-4 py-6 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2">
        <div className="flex w-full max-w-xs items-center justify-between gap-4">
          <Image src="/brand/chicas-en-ia-logo.png" alt="Chicas en IA" width={100} height={25} />
          <Image src="/brand/xstem-logo.svg" alt="XSTEM" width={60} height={19} unoptimized />
        </div>
        <p className="text-xs text-foreground/60">
          Contacto:{" "}
          <a href="mailto:programas@xstemla.com" className="font-semibold underline">
            programas@xstemla.com
          </a>{" "}
          ·{" "}
          <a
            href="https://wa.me/5491139317273"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </footer>
  );
}
