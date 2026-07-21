import "./globals.css";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

import { FileSystemProvider } from '../src/context/FileSystemContext';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: "Portfolio",
  description: "Personal Portfolio",
  icons: {
    icon: "/icons/star.png", // Default icon, can be overridden in pages
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`no-scrollbar ${pressStart2P.variable}`}>
      <body>
        <FileSystemProvider>
            {children}
        </FileSystemProvider>
      </body>
    </html>
  );
}
