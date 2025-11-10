/* eslint-disable unused-imports/no-unused-vars */
'use client';
import { Facebook, Instagram, Mail, MapPin, MoveUpRight, Smartphone, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import FormModified from '@/components/ui/form-modified';

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  whatsapp: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  return (
    <section className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-30 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-start">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 xl:p-10">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Get in touch
              </h1>
              <p className="text-sm sm:text-base md:text-md text-[#525252] leading-relaxed">
                Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <span className="text-sm sm:text-base text-[#525252] font-medium">(303) 555-0105</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <span className="text-sm sm:text-base text-[#525252] font-medium break-all">info@pathcoursehealth.com</span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="text-sm sm:text-base text-[#525252] font-medium">
                  <div>4517 Washington Ave. Manchester,</div>
                  <div>Kentucky 39495</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4">
              <Link
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#F4F4F4] rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            <FormModified
              schema={contactSchema}
              onSubmit={async (values) => {

              }}
              defaultValues={{
                name: '',
                whatsapp: '',
                email: '',
                message: '',
              }}
              disabled={isSubmitting}
            >
              {({ methods, components }) => (
                <div className="space-y-2">
                  {/* Name Field */}
                  <components.Input
                    name="name"
                    label="Name"
                    placeholder="Full name"
                    labelClassName="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider"
                    className="w-full px-0 py-2 sm:py-3 text-base sm:text-lg text-gray-900 placeholder-black bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300"
                  />

                  {/* WhatsApp Field */}
                  <components.Input
                    name="whatsapp"
                    label="Whatsapp number"
                    type="tel"
                    placeholder="Whatsapp number"
                    labelClassName="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider"
                    className="w-full px-0 py-2 sm:py-3 text-base sm:text-lg text-gray-900 placeholder-black bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300"
                  />

                  {/* Email Field */}
                  <components.Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Email"
                    labelClassName="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider"
                    className="w-full px-0 py-2 sm:py-3 text-base sm:text-lg text-gray-900 placeholder-black bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300"
                  />

                  {/* Message Field */}
                  <components.Input
                    name="message"
                    label="Message"
                    placeholder="Write message"
                    labelClassName="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider"
                    className="w-full px-0 py-2 sm:py-3 text-base sm:text-lg text-gray-900 placeholder-black bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300 resize-none"
                  />

                  {/* Submit Button */}
                  <div className="mt-12 sm:mt-16 md:mt-20">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <MoveUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>

                </div>
              )}
            </FormModified>
          </div>
        </div>
      </div>
    </section>
  );
}