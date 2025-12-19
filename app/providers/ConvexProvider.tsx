"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

/**
 * ConvexProvider wrapper for client components
 * Uses NEXT_PUBLIC_CONVEX_URL from environment variables
 * 
 * To set up:
 * 1. Run `npx convex dev` to initialize Convex
 * 2. Add NEXT_PUBLIC_CONVEX_URL to your .env.local file
 */
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

