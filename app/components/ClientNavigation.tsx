'use client';

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ClientNavigation() {
  const pathname = usePathname();
  const showNavigation = 
    !pathname.startsWith("/track") && 
    !pathname.startsWith("/schedule") && 
    !pathname.startsWith("/overview") && 
    !pathname.startsWith("/history") && 
    !pathname.startsWith("/wallet") && 
    !pathname.startsWith("/account") &&
    !(pathname.startsWith("/chat/") && pathname !== "/chat");

  return showNavigation ? <Navigation /> : null;
}