"use client";

import { usePathname } from "next/navigation";

export function PreviewModeExitLink(props) {
  const pathname = usePathname();

  const href = `/api/disable-draft?redirect=${pathname}`;

  // must use <a /> tag (not <Link />) to prevent caching
  return (
    <a href={href} className="underline">
      Exit
    </a>
  );
}
