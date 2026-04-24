import * as React from 'react';
import type { Metadata } from "next";
import { config } from "@/config";

export const metadata = { title: `Store | ${config.site.name}` } satisfies Metadata;

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}
