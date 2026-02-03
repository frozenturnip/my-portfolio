"use client";

import { usePathname } from "next/navigation";

const links = [
  { name: "Projects", href: "/projects" },
  { name: "Photography", href: "/photography" },
  { name: "Professional", href: "/professional" },
  { name: "About", href: "/about" },
];

export default function MainNav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="flex space-x-8 text-[15px] font-medium text-neutral-700 dark:text-sage">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <a
            key={link.name}
            href={link.href}
            className={[
              "relative inline-block pb-1 transition-colors duration-300",
              "hover:text-primary dark:hover:text-darkaccent",
              // underline pseudo-element
              "after:absolute after:left-0 after:-bottom-1.5 after:h-1",
              "after:bg-accent dark:after:bg-darkaccent after:rounded-full",
              "after:transition-all after:duration-300",
              // active vs hover behavior
              isActive ? "text-primary dark:text-darkaccent after:w-full"
                       : "after:w-0 hover:after:w-full",
            ].join(" ")}
          >
            {link.name}
          </a>
        );
      })}
    </nav>
  );
}
