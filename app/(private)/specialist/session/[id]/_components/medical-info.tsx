import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{q}</div>
      <div className="text-sm text-foreground">{a}</div>
    </div>
  );
}

const reports = [
  { title: 'File title.pdf', size: '39mb' },
  { title: 'File title.pdf', size: '39mb' },
];

export default function MedicalDetails() {
  return (
    <section className="rounded-xl border bg-background w-full p-4">
      <Typography variant="p" className="font-bold text-foreground">Medical Details</Typography>
      <div className="mt-2">
        <div className="grid gap-8 lg:grid-cols-3 grid-cols-1">
          <div className="space-y-6">
            <QA q="Is it your first Session?" a="Yes this is my first Session" />
            <QA q="Your pre condition?" a="Mentally, I was not healthy" />
          </div>
          <div className="space-y-6">
            <QA q="Are you taking any medicines?" a="Yes, I am already taking medicines" />
            <QA q="Is there any difference did you feel?" a="Yes, I feel a little bit difference" />
          </div>
          <div className="space-y-6">
            <QA q="Current condition" a="Serious" />
          </div>
        </div>
        <Separator className="my-6 bg-muted/50" />
      </div>

      <div className="mt-6">
        <Typography variant="p" className="font-bold text-foreground mb-4">Reports Attached</Typography>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {reports.map((report, index) => (
            <div key={index} className="flex items-center gap-3">
              <Image
                src="/pdf.svg"
                alt="pdf"
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <div className="text-sm text-foreground">{report.title}</div>
                <div className="text-xs text-muted-foreground">Size: {report.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex lg:justify-end justify-center mt-6">
        <Button variant="default">View Previous Details</Button>
      </div>
    </section>
  );
}