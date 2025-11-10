// React import not needed for React 17+ JSX runtime
import Doctors from "./(public)/doctors"
import Footer from "./(public)/footer"
import Header from "./(public)/header"
import HeroSection from "./(public)/hero-section"
import InfoSection from "./(public)/info-section"
import PoliciesSection from "./(public)/policies"
import PortalsSection from "./(public)/portals"
import ReviewsSection from "./(public)/reviews"
import ServicesSection from "./(public)/services"

export default function MainPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <ServicesSection />
      <InfoSection />
      <Doctors />
      <PortalsSection />
      <ReviewsSection />
      <PoliciesSection />
      <Footer />
    </div>
  )
}
