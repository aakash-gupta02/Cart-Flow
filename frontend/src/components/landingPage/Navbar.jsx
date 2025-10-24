'use client';
import { Menu, Search, ShoppingCart, User, X, LogOut, UserCircle, Package } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

const Navbar = () => {
  const { user, clearUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileModalRef = useRef(null);

  // Close profile modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
        setIsProfileModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const navItems = [
    { name: 'Home', href: '/', isActive: true },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/deals' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
  ];

  const mobileMenuVariants = {
    closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeInOut" } },
    open: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const profileModalVariants = {
    closed: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
    open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } }
  };

  const handleLogout = () => {
    clearUser();
    setIsProfileModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-14 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-between px-4 shadow-lg shadow-black/5"
          >
            <div className="flex items-center justify-between gap-4 w-full">
              {/* Logo */}
              <Link href="/" >
                <motion.h1
                  whileHover={{ scale: 1.05 }}
                  className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                >
                  Cart<span className="text-neutral-400">Flow</span>
                </motion.h1>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={item.name}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${item.isActive
                        ? 'bg-violet-100 text-violet-700 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                  >
                    <Link  href={item.href}>
                      {item.name} </Link>
                  </motion.div>

                ))}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white shadow-sm border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                >
                  <Search className="h-4 w-4 text-neutral-600" />
                </motion.button>

                {/* User State Dependent Buttons */}
                {user ? (
                  <>
                    {/* Cart */}
                    <Link href="/cart" >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white shadow-sm border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                      >
                        <ShoppingCart className="h-4 w-4 text-neutral-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          3
                        </span>
                      </motion.button>
                    </Link>

                    {/* Profile */}
                    <div className="relative" ref={profileModalRef}>
                      <motion.button
                        onClick={() => setIsProfileModalOpen(prev => !prev)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm hover:shadow-md transition-all"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </motion.button>

                      <AnimatePresence>
                        {isProfileModalOpen && (
                          <motion.div
                            variants={profileModalVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-neutral-200/70 p-2 z-50"
                          >
                            <Link href="/profile" onClick={() => setIsProfileModalOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 rounded-md transition-colors">
                              <UserCircle className="h-4 w-4" /> Profile
                            </Link>

                            <Link href="/orders" onClick={() => setIsProfileModalOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 rounded-md transition-colors">
                              <Package className="h-4 w-4" /> Orders
                            </Link>

                            <div className="h-px bg-neutral-200 my-1"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                              <LogOut className="h-4 w-4" /> Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  // If not logged in
                  <motion.div className="flex items-center gap-2">
                    <Link href="/login" passHref>
                      <motion.div   
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-neutral-600 text-sm font-medium hover:text-neutral-900 hover:bg-neutral-100 transition-all"
                      >
                        Login
                      </motion.div>
                    </Link>
                    <Link href="/signup">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        Sign Up
                      </motion.div>
                    </Link>
                  </motion.div>
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white shadow-sm border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4 text-neutral-600" /> : <Menu className="h-4 w-4 text-neutral-600" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-20 left-4 right-4 z-40 md:hidden bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl shadow-black/10 p-6"
            >
              <motion.nav className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <Link key={item.name} href={item.href}>
                    <motion.a
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${item.isActive ? 'bg-violet-100 text-violet-700' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        }`}
                    >
                      {item.name}
                    </motion.a>
                  </Link>
                ))}
              </motion.nav>

              {!user && (
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: navItems.length * 0.1 }}
                  className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-200"
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-neutral-600 text-base font-medium text-center hover:text-neutral-900 hover:bg-neutral-100 transition-all">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-base font-medium text-center shadow-sm hover:shadow-md transition-all">
                    Sign Up
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;