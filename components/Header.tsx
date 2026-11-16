import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500" />
          SiteScope
        </Link>
        <a
          href="https://github.com/flaviaonorato00-lab/sitescope"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-zinc-600 hover:text-black"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
