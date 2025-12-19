"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

/**
 * Main navigation component for Stonefire Pizza
 * Matches the design with light beige background and dark red accents
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragCurrent, setDragCurrent] = useState<number | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleDragStart = (clientY: number, e?: React.MouseEvent) => {
    // Only preventDefault for mouse events
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDragStart(clientY);
    setDragCurrent(clientY);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Global drag handlers to allow dragging even when cursor moves outside
  useEffect(() => {
    if (dragStart === null) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragStart !== null) {
        setDragCurrent(e.clientY);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (dragStart !== null) {
        e.preventDefault();
        setDragCurrent(e.touches[0].clientY);
      }
    };


    const handleGlobalEnd = () => {
      if (dragStart !== null && dragCurrent !== null) {
        const dragDistance = dragCurrent - dragStart;
        if (dragDistance > 50) {
          setIsMenuOpen(false);
        }
      }
      setDragStart(null);
      setDragCurrent(null);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalEnd);
    document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    document.addEventListener("touchend", handleGlobalEnd);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [dragStart, dragCurrent]);

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

          {/* Mobile Menu Button - Custom Animated Hamburger */}
          <div className={`md:hidden relative z-50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}>
            <button
              type="button"
              onClick={toggleMenu}
              className="relative w-10 h-10 flex flex-col justify-center items-center group"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <span
                className={`absolute w-7 h-0.5 bg-[#8B0000] transition-all duration-300 ease-out ${
                  isMenuOpen ? "opacity-0" : "-translate-y-2"
                }`}
              />
              <span
                className={`absolute w-7 h-0.5 bg-[#8B0000] transition-all duration-300 ease-out`}
              />
              <span
                className={`absolute w-7 h-0.5 bg-[#8B0000] transition-all duration-300 ease-out ${
                  isMenuOpen ? "opacity-0" : "translate-y-2"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu - Bottom Sheet */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-gradient-to-b from-[#f5f3f0] to-white z-40 md:hidden rounded-t-3xl shadow-2xl border-t-4 border-[#8B0000] ${
            dragStart === null ? "transition-transform duration-500 ease-out" : ""
          } ${
            isMenuOpen && dragStart === null ? "translate-y-0" : dragStart === null ? "translate-y-full" : ""
          }`}
          style={{ 
            height: "90vh", 
            maxHeight: "90vh",
            transform: dragStart !== null && dragCurrent !== null
              ? `translateY(${Math.max(0, dragCurrent - dragStart)}px)`
              : undefined
          }}
        >
          {/* Drag Handle */}
          <div 
            data-drag-handle
            className="flex justify-center pt-2 pb-1.5 cursor-pointer touch-none select-none"
            onClick={() => {
              if (dragStart === null) {
                closeMenu();
              }
            }}
            onMouseDown={(e) => handleDragStart(e.clientY, e)}
            onTouchStart={(e) => {
              handleDragStart(e.touches[0].clientY);
            }}
          >
            <div className="w-16 h-1.5 bg-[#8B0000] rounded-full"></div>
          </div>

          {/* Backdrop Pattern */}
          <div className="absolute inset-0 opacity-5 rounded-t-3xl overflow-hidden pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #8B0000 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Menu Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header with Logo */}
            <div className="flex justify-center items-center px-4 py-2 border-b-2 border-[#8B0000]/20 flex-shrink-0 bg-gradient-to-r from-[#8B0000]/5 to-transparent">
              <Link href="/" onClick={closeMenu} className="flex items-center">
                <Image
                  src="/stonefiePizza.png"
                  alt="Stonefire Pizza"
                  width={200}
                  height={60}
                  className="object-contain"
                  style={{ width: "200px", height: "auto" }}
                />
              </Link>
            </div>

            {/* Navigation Links - No scrolling needed */}
            <div className="flex-1 px-4 py-3 flex items-center justify-center min-h-0">
              <nav className="space-y-1 w-full">
                {[
                  { href: "/menu", label: "Menu" },
                  { href: "/", label: "About" },
                  { href: "/catering", label: "Catering" },
                  { href: "/jobs", label: "Jobs" },
                  { href: "/", label: "Location" },
                  { href: "/contact", label: "Contact" },
                ].map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className={`block group relative py-2.5 px-5 rounded-xl transition-all ${
                      isMenuOpen ? "animate-slide-up opacity-100" : "opacity-0"
                    } hover:bg-gradient-to-r hover:from-[#8B0000]/10 hover:to-[#8B0000]/5 active:bg-[#8B0000]/15 border-l-4 border-transparent hover:border-[#8B0000]`}
                    style={{
                      animationDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    <span className="text-lg font-bold text-[#1a1a1a] group-hover:text-[#8B0000] transition-colors duration-300 relative inline-block">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Order Now Button - Always Visible */}
            <div className="px-4 py-3 border-t border-[#8B0000]/10 flex-shrink-0 bg-gradient-to-t from-white to-transparent">
              <div
                className={`${
                  isMenuOpen ? "animate-slide-up opacity-100" : "opacity-0"
                }`}
                style={{
                  animationDelay: isMenuOpen ? "350ms" : "0ms",
                }}
              >
                <a
                  href={process.env.NEXT_PUBLIC_TOAST_URL || "/order"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block bg-gradient-to-r from-[#8B0000] to-[#a00000] hover:from-[#a00000] hover:to-[#8B0000] text-white font-bold text-lg py-3.5 px-8 rounded-xl transition-all duration-300 text-center shadow-xl hover:shadow-2xl active:scale-95 transform hover:scale-105"
                >
                  Order Now
                </a>
              </div>
            </div>

            {/* Footer Decoration */}
            <div className="px-6 py-1.5 border-t border-[#8B0000]/10 bg-gradient-to-t from-[#8B0000]/5 to-transparent flex-shrink-0">
              <p className="text-xs font-medium text-[#8B0000]/80 text-center">
                Authentic wood-fired pizzas with passion
              </p>
            </div>
          </div>
        </div>

        {/* Overlay Backdrop */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden animate-fade-in"
            onClick={closeMenu}
          />
        )}
      </div>
    </nav>
  );
}

