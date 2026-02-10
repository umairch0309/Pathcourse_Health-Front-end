// React import not needed for React 17+ JSX runtime

import CookiesConsent from "./(public)/cookies-consent"
import EnterpriseAccessModal from "./(public)/enterprise-access-modal"
import Footer from "./(public)/footer"
import Header from "./(public)/header"
import HeroSection from "./(public)/hero-section"
import PoliciesSection from "./(public)/policies"
import ServicesSection from "./(public)/services"

export default function MainPage() {
  return (
    <div>
      <EnterpriseAccessModal />
      <Header />
      <HeroSection />
      <ServicesSection />
      {/* <InfoSection /> */}
      {/* <Doctors /> */}
      {/* <PortalsSection />
      <ReviewsSection /> */}
      <PoliciesSection />
      <Footer />
      <CookiesConsent />
    </div>
  )
}
