import { MainNav } from "@/components/ui/nav";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header
        className="h-20 w-[100vw] fixed flex items-center z-40 bg-background backdrop-blur-sm"
        style={{ background: "hsla(0,0%,100%,.8)" }}
      >
        <MainNav
          items={[
            { title: "Home", href: "/" },
            { title: "Registration", href: "/registration" },
            { title: "Programs", href: "/#programs" },
            { title: "Terms", href: "/terms" },
          ]}
        />
      </header>
      {children}
    </>
  );
}
