"use client";

import { usePathname } from "next/navigation";

export default function DisplayPathname() {
  const pathname = usePathname();
  return <>{pathname}</>;
}