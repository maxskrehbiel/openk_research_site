"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: [string, string][] = [
  ["/research", "Research"],
  ["/ideas", "Ideas"],
  ["/methods", "Methods"],
  ["/about", "About"],
];

export function Nav() {
  const path = usePathname();
  // A section link stays active on its subpages, e.g. /research on /research/forward-distributions.
  const isActive = (href: string) => path === href || path.startsWith(href + "/");
  return (
    <nav aria-label="Primary" className="nav-links">
      {LINKS.map(([href, label]) => (
        <Link
          key={href}
          className="link"
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
      <Link
        className="link navcta"
        href="/contact"
        aria-current={path === "/contact" ? "page" : undefined}
      >
        Contact
      </Link>
    </nav>
  );
}
