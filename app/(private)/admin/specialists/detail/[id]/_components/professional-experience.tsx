import { Typography } from '@/components/ui/typography';

export default function ProfessionalExperience() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Profession</div>
          <div className="text-md text-foreground">Speech Pathologist</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Age group</div>
          <div className="text-md text-foreground">8-16 years</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Language</div>
          <div className="text-md text-foreground">English, Spanish</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Funding options</div>
          <div className="text-md text-foreground">Card & Cash</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Service delivery</div>
          <div className="text-md text-foreground">Immediate</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-muted-foreground">Special Interest area</div>
        <div className="text-md text-foreground">Developmental Language Disorder (DLD), Literacy, Articulation, Supporting autistic individuals, Parent and caregiver coaching, Early language supports, Social Skills</div>
      </div>
    </div>
  );
}