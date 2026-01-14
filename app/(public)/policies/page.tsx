import { Typography } from "@/components/ui/typography"

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-background py-8 lg:py-12 px-4 lg:px-6 md:px-8">
      <div className="container mx-auto max-w-4xl py-8 lg:py-12">
        {/* Main Title */}
        <Typography
          variant="h3"
          className="text-foreground font-bold text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-10 md:mb-12"
        >
          Privacy Policy
        </Typography>

        {/* First Section - Four paragraphs */}
        <div className="space-y-4 mb-8">
          <Typography variant="span" className="text-justify text-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Sed ut perspiciatis
            unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
            ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
            autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
            nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
            voluptas nulla pariatur?
          </Typography>
        </div>

        {/* Second Section - Subheading and three paragraphs */}
        <div className="space-y-4 mb-8">
          <Typography
            variant="p"
            className="font-semibold text-xl sm:text-2xl mb-4 text-foreground"
          >
            Norem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Sed ut perspiciatis
            unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
            ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem.
          </Typography>
        </div>

        {/* Third Section - Subheading and three paragraphs */}
        <div className="space-y-4 mb-8">
          <Typography
            variant="p"
            className="font-semibold text-xl sm:text-2xl mb-4 text-foreground"
          >
            Norem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Sed ut perspiciatis
            unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
            ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
            numquam eius modi tempora incidunt ut labore et dolore magnam
            aliquam quaerat voluptatem.
          </Typography>
        </div>

        {/* Fourth Section - Subheading and one paragraph */}
        <div className="space-y-4">
          <Typography
            variant="p"
            className="font-semibold text-xl sm:text-2xl mb-4 text-foreground"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="span" className="text-justify text-foreground">
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
            autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
            nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
            voluptas nulla pariatur?
          </Typography>
        </div>
      </div>
    </section>
  )
}
