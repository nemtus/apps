import SymbolLogoLight from "@/assets/symbol-logo-with-text-light.png";
import { SignUpForm } from "@/components/signup-form";
import { Link } from "@/components/ui/link";
import { navigations } from "@/lib/navigations";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Registration: Symbol/NEM Community Xymposium",
  description: "Community Xymposium への参加申し込み",
};

export default function AuthenticationPage() {
  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="max-w-md flex flex-col items-center space-y-8">
        <Link href={navigations.index}>
          <Image loading="eager" alt="symbol logo" src={SymbolLogoLight} height={40} />
        </Link>
        <SignUpForm className="z-10" />
        <div className="h-10" />
      </div>
    </div>
  );
}
