import Footer from "../footer"
import Header from "../header"
import PoliciesSection from "../policies"

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      {children}
      <PoliciesSection />
      <Footer />
    </div>
  )
}
