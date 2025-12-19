import Link from "next/link";
import Image from "next/image";

/**
 * Main navigation component for Stonefire Pizza
 * Matches the design with light beige background and dark red accents
 */
export default function Navigation() {
  return (
    <nav className="bg-[#f5f3f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center relative">
            <Image
              src="/stonefiePizza.png"
              alt="Stonefire Pizza"
              width={400}
              height={120}
              className="object-contain"
              style={{ width: "320px", height: "auto" }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/menu"
              className="text-[#2c2c2c] hover:text-[#8B0000] transition-colors font-medium"
            >
              Menu
            </Link>
            <Link
              href="/"
              className="text-[#2c2c2c] hover:text-[#8B0000] transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/catering"
              className="text-[#2c2c2c] hover:text-[#8B0000] transition-colors font-medium"
            >
              Catering
            </Link>
            <Link
              href="/jobs"
              className="text-[#2c2c2c] hover:text-[#8B0000] transition-colors font-medium"
            >
              Jobs
            </Link>
            <Link
              href="/"
              className="text-[#2c2c2c] hover:text-[#8B0000] transition-colors font-medium"
            >
              Location
            </Link>
            <Link
              href="/contact"
              className="text-[#2c2c2c] hover:text-[#8B0000] transition-colors font-medium"
            >
              Contact
            </Link>
            <div className="flex items-center space-x-3 ml-4">
              <a
                href={process.env.NEXT_PUBLIC_TOAST_URL || "/order"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#8B0000] hover:bg-[#700000] text-white font-semibold py-2 px-6 rounded transition-colors"
              >
                Order Now
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-[#2c2c2c] hover:text-[#8B0000]"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

