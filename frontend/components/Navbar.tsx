// frontend/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Helper component for links
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
            : 'text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">
              TodoApp
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink href="/" label="Home" />
            {isAuthenticated && <NavLink href="/dashboard" label="Dashboard" />}
            {isAuthenticated && <NavLink href="/profile" label="Profile" />}
            {!isAuthenticated && <NavLink href="/login" label="Sign In" />}
            {!isAuthenticated && <NavLink href="/signup" label="Sign Up" />}
            {isAuthenticated && (
              <button
                onClick={signOut}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 dark:text-zinc-300 dark:hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 px-2 bg-white dark:bg-zinc-900 shadow-lg">
          <NavLink href="/" label="Home" />
          {isAuthenticated && <NavLink href="/dashboard" label="Dashboard" />}
          {isAuthenticated && <NavLink href="/profile" label="Profile" />}
          {!isAuthenticated && <NavLink href="/login" label="Sign In" />}
          {!isAuthenticated && <NavLink href="/signup" label="Sign Up" />}
          {isAuthenticated && (
            <button
              onClick={signOut}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 dark:text-zinc-300 dark:hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
