import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restructure ta pièce",
  description: "Prends une photo d'une pièce, l'IA te donne des conseils pour l'améliorer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
