import Image from 'next/image';
import { Typography } from '@/components/ui/typography';

export default function EducationInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-muted rounded-lg p-4 space-y-4">
        <Typography variant="p" className="font-bold text-foreground">Degree 01</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Title</div>
            <div className="text-md text-foreground">M.B.B.S</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Institute:</div>
            <div className="text-md text-foreground">Oxford University</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Start date:</div>
            <div className="text-md text-foreground">September 2014</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Completion date</div>
            <div className="text-md text-foreground">August 2020</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Institute location:</div>
          <div className="text-md text-foreground">4517 Washington Ave, Manchester, Kentucky 39495</div>
        </div>

        <div className="pt-2">
          <Typography variant="span" className="font-bold text-foreground">Attached File</Typography>
          <div className="flex items-center gap-2 mt-1">
            <Image
              src="/pdf.svg"
              alt="pdf"
              width={40}
              height={40}
            />
            <Typography variant="p" className="text-foreground">
              Degree.pdf
            </Typography>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 space-y-4">
        <Typography variant="p" className="font-bold text-foreground">Degree 02</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Title</div>
            <div className="text-md text-foreground">M.B.B.S</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Institute:</div>
            <div className="text-md text-foreground">Oxford University</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Start date:</div>
            <div className="text-md text-foreground">September 2014</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Completion date</div>
            <div className="text-md text-foreground">August 2020</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Institute location:</div>
          <div className="text-md text-foreground">4517 Washington Ave, Manchester, Kentucky 39495</div>
        </div>
        <div className="pt-2">
          <Typography variant="span" className="font-bold text-foreground">Attached File</Typography>
          <div className="flex items-center gap-2 mt-1">
            <Image
              src="/pdf.svg"
              alt="pdf"
              width={40}
              height={40}
            />
            <div className="text-md text-foreground">
              Degree.pdf
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}