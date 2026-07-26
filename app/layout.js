import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "styled-components";
import { Toaster } from "sonner";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/lib/globalStyles";
import { theme } from "@/lib/theme";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Basecourse — University Portal",
  description: "Sign in to your university portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
