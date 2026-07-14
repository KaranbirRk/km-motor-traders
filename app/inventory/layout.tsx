import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock | KM Motor Traders",
  description:
    "Browse available and upcoming used cars at KM Motor Traders, Dandenong VIC.",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
