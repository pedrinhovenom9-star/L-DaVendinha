import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "Lá da Vendinha",
  description: "Marketplace de negócios locais"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#111",
                borderRadius: "20px",
                padding: "16px",
                fontWeight: "700"
              },
              success: {
                iconTheme: {
                  primary: "#ea580c",
                  secondary: "#fff"
                }
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}