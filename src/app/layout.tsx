import "@/styles/globals.css";
import { NextProvider, NextLayout } from "./providers";
import { Metadata } from "next";
import GoogleAnalytics from "@/app/googleAnalytics";

export const metadata: Metadata = {
    title: "Portfolio NextMap",
    description: "Next.js 마이그레이션 맛집앱",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <GoogleAnalytics
                    GA_TRACKING_ID={process.env.NEXT_PUBLIC_GA_ID}
                />
                <NextProvider>
                    <NextLayout>{children}</NextLayout>
                </NextProvider>
            </body>
        </html>
    );
}
