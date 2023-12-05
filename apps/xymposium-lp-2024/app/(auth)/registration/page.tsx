import SymbolLogoLight from "@/assets/symbol-logo-with-text-light.png";
import { SignUpForm } from "@/components/atom/moleculs/signup-form";
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
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 px-3 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 w-full h-screen after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0"
          style={{
            backgroundImage: `url(/xymposium-invitation.jpg)`,
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Empowering People with Blockchain. Welcome to Symbol/NEM. L1 chain that is easy to install and can be used
              by anyone, anytime.
            </p>
            <footer className="text-sm">Symbol Community</footer>
          </blockquote>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-0 right-0 w-screen h-screen bg-[url('/xymposium-invitation.jpg')] bg-top bg-no-repeat bg-cover lg:bg-none" />
      <div className="mx-auto min-h-screen h-full flex w-full flex-col justify-center space-y-6 max-w-sm">
        <div className="lg:flex items-center justify-center mt-8 mb-4 hidden lg:visible">
          <Link href={navigations.index}>
            <Image loading="eager" alt="symbol logo" src={SymbolLogoLight} height={40} />
          </Link>
        </div>
        <SignUpForm className="z-10" />
        <div className="h-10" />
      </div>
    </div>
  );
}
