import Link from "next/link";

const Header = () => {
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Vibe", path: "/vibe" },
    { label: "Record", path: "/record" },
    { label: "Board", path: "/board" },
  ];

  return (
    <header className="w-full grid grid-cols-3 items-center p-6 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="text-2xl font-black tracking-tight text-black-600">
        <Link href="/">NY ARCHIVE</Link>
      </div>

      <nav className="flex justify-center">
        <ul className="flex space-x-8">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="text-gray-600 font-medium hover:text-orange-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
