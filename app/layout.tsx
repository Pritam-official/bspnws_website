import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./(home)/globals.css";
import ConditionalFooter from "@/components/shared/ConditionalFooter";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Burdwan Sadar Pyara Nutrition Welfare Society",
  description: "Burdwan Sadar Pyara Nutrition Welfare Society - Empowering Nutrition and Welfare",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('viewMode');
                  if (mode === 'desktop') {
                    var meta = document.querySelector('meta[name="viewport"]');
                    if (meta) {
                      meta.setAttribute('content', 'width=1200');
                    }
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <main className="flex-grow relative z-10">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}

