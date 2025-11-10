'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

export default function PoliciesSection() {
  return (
    <section className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Image src="/logo-footer.svg" alt="Logo" width={120} height={40} className=" object-cover mb-2" />
            <Typography as="span" variant="span" className="text-white mt-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit metus ex. </Typography>
          </div>

          <div className="md:col-span-1">
            <Typography as="h3" variant="h5" className="text-lg font-semibold mb-4 text-white">Quick Links</Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Specialists
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <Typography as="h3" variant="h5" className="text-lg font-semibold mb-4 text-white">Our Policies</Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <Typography as="h3" variant="h5" className="text-lg font-semibold mb-4 text-white">Join Our Mailing List.</Typography>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-transparent border-0 border-b border-gray-600 rounded-none text-white placeholder:text-white focus:border-primary focus:ring-0 focus:ring-offset-0 focus:outline-none shadow-none px-0"
              />
              <Button>
                Subscribe
                <Image src="/MoveUpWhite.svg" alt="Move Up" width={17} height={17} className="inline-block ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}