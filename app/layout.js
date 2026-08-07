import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "styled-components";
import { Toaster } from "sonner";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyles from "@/lib/globalStyles";
import { theme } from "@/lib/theme";
import QueryProvider from "@/providers/QueryProvider";

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

// The fallback every route inherits unless it exports its own. Keep it
// describing the product, not any one page -- this used to say "Sign in
// to your university portal", which was written when /login was the only
// page and left every dashboard route describing a sign-in form.
export const metadata = {
  title: "Basecourse — University Portal",
  description: "Student record system for courses, enrollment, and grades.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <QueryProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </QueryProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
