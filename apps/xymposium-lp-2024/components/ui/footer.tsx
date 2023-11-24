import SymbolLogoDark from "@/assets/symbol-logo-with-text-dark.png";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/components/ui/link";
import Image from "next/image";

export function Footer(): JSX.Element {
  return (
    <div className="bg-gray-900">
      <footer className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="py-10 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6 lg:gap-8 lg:pt-12">
          <div className="col-span-full lg:col-span-2">
            <div className="mb-4 lg:-mt-2">
              <Link variant="default" rel="noopener">
                <Image loading="lazy" src={SymbolLogoDark} alt="Symbol" height={40} />
              </Link>
            </div>
            <p className="mb-6 text-gray-400 sm:pr-8">Empowering People with Blockchain</p>
            <div className="flex gap-4">
              <Link target="_blank" href="https://symbol-community.com/" rel="noopener" className="text-gray-400">
                <Icons.site className="w-5 h-5" />
              </Link>
              <Link target="_blank" href="https://discord.gg/TT2tvxFfN4" rel="noopener" className="text-gray-400">
                <Icons.chat className="w-5 h-5" />
              </Link>
              <Link target="_blank" href="https://twitter.com/symnem_com_info" rel="noopener" className="text-gray-400">
                <Icons.twitter className="w-4 h-4" />
              </Link>
              <Link target="_blank" href="https://github.com/symbol" rel="noopener" className="text-gray-400 ">
                <Icons.gitHub className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8 text-center text-sm text-gray-400">
          Symbol/NEM Community Xymposium 主催 NPO法人NEM技術普及推進会NEMTUS <br />© 2023 - Symbol Community WEB DAO.
          All rights reserved.
        </div>
      </footer>
    </div>
  );
}
