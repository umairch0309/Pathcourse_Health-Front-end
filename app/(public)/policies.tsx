"use client"
import Image from "next/image"
import Link from "next/link"
import { Typography } from "@/components/ui/typography"

export default function PoliciesSection() {
  return (
    <section className="bg-black text-white py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="md:col-span-1">
            <Image
              src="/logo-footer.svg"
              alt="Logo"
              width={120}
              height={40}
              className=" object-cover mb-2"
            />
          </div>

          <div className="md:col-span-1">
            <Typography
              as="h3"
              variant="h5"
              className="text-lg font-semibold mb-4 text-white"
            >
              Quick Links
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/service"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <Typography
              as="h3"
              variant="h5"
              className="text-lg font-semibold mb-4 text-white"
            >
              Our Policies
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/policies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
