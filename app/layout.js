import "./globals.css";

export const metadata = {
  title: "DocAi - AI-Powered Health Analysis",
  description: "Analyze medical reports with AI. Get insights on problems, solutions, precautions, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
