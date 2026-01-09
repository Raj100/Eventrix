"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Eventrix</h3>
            <p className="text-sm opacity-80">
              Your one-stop solution for premium custom prints and personalized products.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/products/mugs" className="hover:opacity-100">
                  Mugs
                </Link>
              </li>
              <li>
                <Link href="/products/t-shirts" className="hover:opacity-100">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/products/business-cards" className="hover:opacity-100">
                  Business Cards
                </Link>
              </li>
              <li>
                <Link href="/products/gifts" className="hover:opacity-100">
                  Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/about" className="hover:opacity-100">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:opacity-100">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-100">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@eventrix.com" className="hover:opacity-100">
                  info@eventrix.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+919876543210" className="hover:opacity-100">
                  +91 9876 543 210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Exhibition St, Studio City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm opacity-80">
          <p>&copy; 2025 Eventrix Exhibition & Studio. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:opacity-100">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:opacity-100">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
