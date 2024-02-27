import type { Metadata } from "next";
import "./globals.css";

// import "bootstrap-honoka/dist/css/bootstrap.min.css";
// import "bootstrap-rin/dist/css/bootstrap.min.css";
import "bootstrap-nico/dist/css/bootstrap.min.css";

const siteName: string = "だいたいBPM";
const description: string = "主にアニソンのおおよそのBPMを掲載しています。";
const url: string = process.env.NEXT_PUBLIC_BASE_URL || "";
const googleSearchConsole: string = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE || "";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: siteName,
  description,
  keywords: ["BPM", "bpm", "アニソン", "だいたいBPM", "だいたいbpm", "aboutBPM"],
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `${url}/ogp_default.png`,
        width: 1200,
        height: 630,
        alt: "OGP画像の代替テキスト - だいたいBPMのイメージ画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: [
      {
        url: `${url}/ogp_default.png`,
        width: 1200,
        height: 630,
        alt: "OGP画像の代替テキスト - だいたいBPMのイメージ画像",
      },
    ],
    site: "@",
    creator: "@",
  },
  verification: {
    google: googleSearchConsole,
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="m-3"
        style={{
          backgroundColor: "##f1f7fc",
          opacity: 0.8,
          backgroundImage: "radial-gradient(##f1e8f7 0.5px, ###fff7fc 0.5px)",
          backgroundSize: "10px 10px",
          // overflowY: "scroll",
          // スクロールバーを常に表示
          // スクロールバーを常に非表示
          // scrollbarWidth: "none",
        }}
      >
        {children}</body>
    </html >
  );
}
