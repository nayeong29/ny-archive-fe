import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-white p-8 mt-auto border-t border-gray-100">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">© 2026 NY Archive.</p>

        <div className="flex space-x-6">
          <Link
            href="https://github.com/nayeong29"
            className="text-gray-600 hover:underline"
          >
            GitHub
          </Link>
          <Link
            href="https://velog.io/@nayeong29/posts"
            className="text-gray-600 hover:underline"
          >
            Velog
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
