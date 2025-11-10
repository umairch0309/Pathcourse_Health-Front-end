'use client';

import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { doctors } from '@/app/data/doctors';

export default function AllDoctors() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') ?? '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return doctors;
    }
    return doctors.filter(d =>
      d.name.toLowerCase().includes(q)
      || d.specialty.toLowerCase().includes(q)
      || (d.description ?? '').toLowerCase().includes(q),
    );
  }, [searchTerm]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4">
        <div className="space-y-4 mb-6 lg:flex lg:justify-between">
          {/* Search Input with Icon */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full text-sm">
                <option>Sort by</option>
                <option>Name A-Z</option>
                <option>Name Z-A</option>
                <option>Rating High-Low</option>
                <option>Rating Low-High</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full text-sm">
                <option>By price</option>
                <option>Low to High</option>
                <option>High to Low</option>
                <option>Under $30</option>
                <option>$30 - $50</option>
                <option>Over $50</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative sm:col-span-2 lg:col-span-1">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full text-sm">
                <option>By service</option>
                <option>Neuro Doctor</option>
                <option>Heart Doctor</option>
                <option>Ortho Doctor</option>
                <option>General Medicine</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDoctors.map(doctor => (
            <Link href={`/doctors/${doctor.id}`} key={doctor.id}>
              <div key={doctor.id} className="bg-muted rounded-2xl py-6 px-8 text-center items-center shadow-sm">
                {/* Doctor Image with Decorative Border */}
                <div className="relative mb-6 mx-auto size-50 flex items-center justify-center">
                  {/* Top dot */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
                    <div className="w-2" />
                    <Image
                      src="/dot.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                    <div className="w-2" />
                  </div>
                  
                  {/* Circular border */}
                  <div className="w-full h-full rounded-full border-2 border-secondary/50 p-3">
                    <div className="w-full h-full rounded-full overflow-hidden bg-accent">
                      <Image
                        src={doctor.image || '/placeholder.svg'}
                        alt={doctor.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Bottom dot */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 flex items-center gap-1">
                    <div className="w-2" />
                    <Image
                      src="/dot.svg"
                      alt=""
                      width={10}
                      height={10}
                    />
                    <div className="w-2" />
                  </div>
                </div>

                <Typography as="h3" variant="h4" className="text-center font-bold text-foreground">
                  {doctor.name}
                </Typography>

                <Typography variant="p" className="font-semibold text-center text-secondary">
                  {doctor.specialty}
                </Typography>

                <Typography variant="span" className="text-foreground text-center">
                  {doctor.description}
                </Typography>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}