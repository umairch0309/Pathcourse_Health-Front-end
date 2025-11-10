import { Typography } from '@/components/ui/typography';

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-muted rounded-lg p-4 space-y-3">
        <Typography variant="p" className="font-bold text-foreground">Personal Contact Info</Typography>
        <div className="grid lg:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Contact no.</div>
            <div className="text-md text-foreground">+1n(234) 567-8900</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Email:</div>
            <div className="text-foreground">username@gmail.com</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Location:</div>
            <div className="text-foreground">4517 Washington Ave, Manchester, Kentucky 39495</div>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 space-y-3">
        <Typography variant="p" className="font-bold text-foreground">Professional Contact Info</Typography>
        <div className="grid lg:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">Contact no.</div>
            <div className="text-foreground">+1n(234) 567-8900</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Email:</div>
            <div className="text-foreground">username@gmail.com</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Location:</div>
            <div className="text-foreground">4517 Washington Ave, Manchester, Kentucky 39495</div>
          </div>
        </div>
      </div>
    </div>
  );
}