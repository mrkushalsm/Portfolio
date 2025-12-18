import "./globals.css";

export const metadata = {
  title: "Portfolio",
  description: "Personal Portfolio",
  icons: {
    icon: "/icons/star.png", // Default icon, can be overridden in pages
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="no-scrollbar">
      <body>{children}</body>
    </html>
  );
}
