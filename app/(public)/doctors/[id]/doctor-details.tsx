'use client';

import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DoctorDetails() {
  const router = useRouter();
  const params = useParams();
  
  // Get doctor ID from params, with proper type checking
  const getDoctorId = () => {
    if (!params || !params.id) {
      console.warn('No doctor ID found in params, using default ID 1');
      return 1;
    }
    
    // Handle both string and array cases
    const idString = Array.isArray(params.id) ? params.id[0] : params.id;
    
    if (!idString) {
      console.warn('Doctor ID is empty, using default ID 1');
      return 1;
    }
    
    const numId = parseInt(idString, 10);
    
    if (isNaN(numId) || numId <= 0) {
      console.warn(`Invalid doctor ID: ${idString}, using default ID 1`);
      return 1;
    }
    
    return numId;
  };

  const doctorId = getDoctorId();

  const handleBookAppointment = () => {
    const url = `/book-session?doctorId=${doctorId}&step=details`;
    console.log('Navigating to:', url);
    router.push(url as any);
  };

  return (
    <section className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 bg-white">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 md:p-10">
        {/* Left: Doctor Image */}
        <div className="w-full lg:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] md:justify-self-center lg:justify-self-start rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/dr-jane.png" // Replace with actual image
            alt="Dr. Jane Markus"
            width={500}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right: Doctor Info */}
        <div className="flex-1 space-y-4 sm:space-y-6 lg:mt-8">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-2 text-center lg:text-left">Dr. Jane Markus</h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3 justify-center lg:justify-start">
              <span className="text-xs bg-muted text-[#525252] px-3 py-2 sm:p-3 rounded-full">MBBS</span>
              <span className="text-xs bg-muted text-[#525252] px-3 py-2 sm:p-3 rounded-full">FCPS</span>
              <span className="text-xs bg-muted text-[#525252] px-3 py-2 sm:p-3 rounded-full">Speech Pathologist</span>
              <span className="text-xs bg-muted text-[#525252] px-3 py-2 sm:p-3 rounded-full">+2 more</span>
            </div>

            {/* Bio */}
            <p className="text-[#525252] text-sm sm:text-base max-w-2xl text-center lg:text-left">
              Yorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie,
              dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
              sollicitudin lacus, ut interdum tellus elit sed risus...
              <span className="text-blue-600 cursor-pointer ml-1">Read more</span>
            </p>

            <p className="text-xl sm:text-2xl font-semibold text-black mt-3 text-center lg:text-left">$200.00</p>
          </div>

          {/* Price + CTA */}
          <div className="flex gap-4 border-b pb-4 sm:pb-6 justify-center lg:justify-start">
            <Button variant="default" onClick={handleBookAppointment} className="w-full sm:w-auto">
              Book Your Appointment
              {' '}
              <Image src="/MoveUpWhite.svg" alt="Move Up" width={17} height={17} className="inline-block ml-1" />
            </Button>
          </div>

          {/* Availability and Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b pb-4 sm:pb-6 gap-4 sm:gap-6">
            <div className='sm:border-r sm:pr-6'>
              <h4 className="text-lg sm:text-xl font-semibold text-black text-center sm:text-left">Availability</h4>
              <p className="text-gray-700 text-sm mt-1 text-center sm:text-left">Mon - Fri</p>
              <p className="text-black text-base sm:text-lg text-center sm:text-left">08:00 AM – 04:00 PM</p>
            </div>
            <div className='sm:pl-6'>
              <h4 className="text-lg sm:text-xl font-semibold text-black text-center sm:text-left">Language</h4>
              <p className="text-gray-700 text-sm mt-1 text-center sm:text-left">Multiple</p>
              <p className="text-black text-base sm:text-lg text-center sm:text-left">English, Spanish</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1 text-center lg:text-left">Location</h4>
            <p className="text-black text-base sm:text-lg text-center lg:text-left">
              4517 Washington Ave. Manchester, Kentucky 39495
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}