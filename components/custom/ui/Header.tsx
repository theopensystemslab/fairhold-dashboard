
export const Header = () => (
  <header className="static top-0 left-0 bg-transparent flex items-center justify-center px-4 py-4 z-50 max-h-[60px]"
      style={{ background: "rgb(var(--background-start-rgb))" }}
  >
    <section className="w-full max-w-[1280px] flex flex-row py-8">
      <div className="w-1/4 flex items-center">
        <a href="#" className="brand w-nav-brand"><div className="logo">Fairhold</div></a>
      </div>
      <div className="w-3/4">
        <nav className="flex flex-row justify-end items-center space-x-0 w-nav-menu">
          <a href="#" className="nav-link w-nav-link">Home</a>
          <a href="#" className="nav-link w-nav-link">Explore</a>
          <a href="#" className="nav-link w-nav-link">Take the survey</a>
          <a href="#" className="nav-link w-nav-link">Contact</a>
        </nav>
      </div>
    </section>
  </header>
);