/* eslint-disable unused-imports/no-unused-vars */
"use client"
import { Mail, MoveUpRight } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"

// Contact form schema
const contactSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters"),
  organizationEmail: z
    .string()
    .min(1, "Organization email is required")
    .email("Please enter a valid email"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")

  return (
    <section className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-30 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 items-start">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 px-6 lg:py-0 py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:mb-6 font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Get in touch
              </h1>
              <p className="text-sm sm:text-base md:text-md text-[#525252] leading-relaxed">
                PathCourse Health is an enterprise-only platform. If you are an
                organization interested in offering Open Ear as a wellness
                solution for your employees, students, members, or community,
                please contact us at the email below with a brief description of
                your organization and inquiry
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <span className="text-sm sm:text-base text-[#525252] font-medium break-all">
                  admin@pathcoureshealth.com
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            <FormModified
              schema={contactSchema}
              onSubmit={async (values) => {}}
              defaultValues={{
                organizationName: "",
                organizationEmail: "",
                message: "",
              }}
              disabled={isSubmitting}
            >
              {({ methods, components }) => (
                <div className="space-y-2">
                  {/* Organization Name Field */}
                  <components.Input
                    name="organizationName"
                    label="Organization Name"
                    placeholder="Organization name"
                    labelClassName="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider"
                    className="w-full px-0 py-2 sm:py-3 text-base sm:text-lg text-gray-900 placeholder-black bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300"
                  />

                  {/* Organization Email Field */}
                  <components.Input
                    name="organizationEmail"
                    label="Organization Email"
                    type="email"
                    placeholder="Organization email"
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
                      {isSubmitting ? "Sending..." : "Send Message"}
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
  )
}
