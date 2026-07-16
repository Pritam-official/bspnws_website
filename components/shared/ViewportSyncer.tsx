"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ViewportSyncer() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("viewMode");
      const isDesktop = savedMode === "desktop";
      
      const content = isDesktop 
        ? "width=1200" 
        : "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
        
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute("content", content);
      }
    } catch (err) {
      console.error("Error syncing viewport mode:", err);
    }
  }, [pathname]);

  return null;
}
