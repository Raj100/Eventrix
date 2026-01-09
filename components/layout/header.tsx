"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingCart, User, Sun, Moon, LogOut } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useAuthStore, useCartStore } from "@/lib/zustand-store"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const router = useRouter()
  const { user, role, logout } = useAuthStore()
  const { items } = useCartStore()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary">
              Eventrix
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm hover:text-primary transition">
              Products
            </Link>
            <Link href="/customize" className="text-sm hover:text-primary transition">
              Customize
            </Link>
            {role === "admin" && (
              <Link href="/admin" className="text-sm hover:text-primary transition font-bold text-accent">
                Admin
              </Link>
            )}
            <Link href="/about" className="text-sm hover:text-primary transition">
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                <Link href="/account" className="p-2 hover:bg-muted rounded-lg transition" aria-label="Account">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-muted rounded-lg transition" aria-label="Logout">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition">
                Sign In
              </Link>
            )}

            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition" aria-label="Cart">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 border-t border-border pt-4">
            <Link href="/products" className="block py-2 text-sm hover:text-primary">
              Products
            </Link>
            <Link href="/customize" className="block py-2 text-sm hover:text-primary">
              Customize
            </Link>
            {role === "admin" && (
              <Link href="/admin" className="block py-2 text-sm hover:text-primary font-bold text-accent">
                Admin
              </Link>
            )}
            <Link href="/about" className="block py-2 text-sm hover:text-primary">
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
