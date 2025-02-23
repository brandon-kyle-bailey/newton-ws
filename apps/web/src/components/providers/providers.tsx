"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { Toaster } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";
import { SessionContextProvider } from "./session.provider";
import { ThemeProvider } from "./theme.provider";

export function Providers({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <SessionContextProvider>{children}</SessionContextProvider>
      </TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}
