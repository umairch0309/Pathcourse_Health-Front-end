import Footer from "../footer"
import Header from "../header"
import Policies from "../policies"
import Banner from "./contact-banner"
import ContactSection from "./contact-page"

export default function Skin() {
  return (
    <div>
      <Header />
      <Banner />
      <ContactSection />
      <Policies />
      <Footer />
    </div>
  )
}
