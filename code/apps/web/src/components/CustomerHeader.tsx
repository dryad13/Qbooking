import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

interface CustomerHeaderProps {
  bookingRef?: string;
  backLabel?: string;
  backHref?: string;
}

export function CustomerHeader({ backLabel, backHref }: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 md:px-6 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Image src="/logo.jpeg" alt="99 Cattle Farm" width={36} height={36} className="rounded-md" />
          <span className="font-bold text-lg text-primary hidden sm:block">99 Cattle Farm</span>
        </Link>

        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel ?? "Back"}
          </Link>
        )}
      </div>
    </header>
  );
}
