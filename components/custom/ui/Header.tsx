import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons"

export const Header = () => {
  return (
  <header className="fixed top-0 left-0 w-full bg-transparent flex items-center justify-center px-4 py-4 z-40 max-h-[60px]"
    style={{ background: "rgb(var(--background-start-rgb))" }}
  >
    <section className="w-full max-w-[1280px] flex flex-row items-center justify-between py-4 md:py-8">
      <div className="flex items-center">
        <a href="#" className="brand w-nav-brand">
          <div className="logo">Fairhold</div>
        </a>
      </div>
      <DesktopHeader />
      <MobileHeader />
      </section>
    </header>
  );
};

const DesktopHeader = () => {
  return (
    <div className="hidden md:block">
      <nav className="flex flex-row justify-end items-center space-x-0 w-nav-menu">
        <ul className="flex flex-row space-x-6">
          <Links />
        </ul>
      </nav>
    </div>
  );
};

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end items-center md:hidden">
        <button
          className="p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
        <HamburgerMenuIcon />
        </button>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col md:hidden">
          <div className="bg-white w-2/3 h-full p-8 flex flex-col ml-auto">
            <button className="mb-8 self-end" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <nav className="flex flex-col flex-1 align-center">
              <ul className="flex flex-col space-y-4 items-center list-none m-0 p-0">
                <Links />
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

const Links = () => {
  return (
    <>
        <li><a href="#" className="nav-link w-nav-link">Home</a></li>
        <li><a href="#" className="nav-link w-nav-link">Explore</a></li>
        <li><a href="#" className="nav-link w-nav-link">Take the survey</a></li>
        <li><a href="#" className="nav-link w-nav-link">Contact</a></li>
    </>
  )
}