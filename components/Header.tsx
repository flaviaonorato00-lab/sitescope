import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
        <Link href="/" className="text-lg font-bold">
          SiteScope
        </Link>
        <ul className="flex gap-6 text-sm text-zinc-600">
          <li>
            <Link href="/" className="hover:text-black">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-black">
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}