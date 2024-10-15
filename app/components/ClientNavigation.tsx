'use client';

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ClientNavigation() {
  const pathname = usePathname();
  const showNavigation = pathname !== "/track" && pathname !== "/schedule" && pathname !== "/overview"&& pathname !== "/wallet" && pathname !== "/account";

  return showNavigation ? <Navigation /> : null;
}