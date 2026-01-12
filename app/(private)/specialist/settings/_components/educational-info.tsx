"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parse } from 'date-fns';

// Mock data - in real app, this would come from API
const educationData = [
  {
    degreeTitle: 'Doctor of Medicine',
    instituteName: 'Harvard Medical School',
    startDate: '2010-09-01',
    completionDate: '2014-06-30',
    instituteAddress: '25 Shattuck St, Boston, MA 02115',
  },
  {
    degreeTitle: 'Bachelor of Science',
    instituteName: 'MIT',
    startDate: '2006-09-01',
    completionDate: '2010-06-30',
    instituteAddress: '77 Massachusetts Ave, Cambridge, MA 02139',
  },
];

export default function EducationalInfo() {
  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>
          <div className='text-foreground font-bold'>Educational Info</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 lg:space-y-8">
        {educationData.map((edu, index) => (
          <div key={index} className="space-y-4">
            <div className="mb-4 lg:mb-6 font-semibold text-foreground">
              Education {index + 1}
            </div>

            <div className="block lg:hidden space-y-4">
              <div>
                <div className="text-foreground mb-2">Degree title</div>
                <div className="text-muted-foreground border-b pb-2">{edu.degreeTitle}</div>
              </div>
              <div>
                <div className="text-foreground mb-2">Institute name</div>
                <div className="text-muted-foreground border-b pb-2">{edu.instituteName}</div>
              </div>
              <div>
                <div className="text-foreground mb-2">Start date</div>
                <div className="text-muted-foreground border-b pb-2">
                  {edu.startDate ? format(parse(edu.startDate, 'yyyy-MM-dd', new Date()), 'PPP') : '-'}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2">Completion date</div>
                <div className="text-muted-foreground border-b pb-2">
                  {edu.completionDate ? format(parse(edu.completionDate, 'yyyy-MM-dd', new Date()), 'PPP') : '-'}
                </div>
              </div>
              <div>
                <div className="text-foreground mb-2 font-medium">Institute address</div>
                <div className="text-muted-foreground border-b pb-2">{edu.instituteAddress}</div>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2">
              <div className="space-y-6">
                <div className="text-foreground border-b p-2 font-medium text-sm">Degree title</div>
                <div className="text-foreground border-b p-2 font-medium text-sm">Institute name</div>
                <div className="text-foreground border-b p-2 font-medium text-sm">Start date</div>
                <div className="text-foreground border-b p-2 font-medium text-sm">Completion date</div>
                <div className="text-foreground border-b p-2 font-medium text-sm">Institute address</div>
              </div>
              <div className="space-y-6">
                <div className="border-b p-2 text-sm">{edu.degreeTitle}</div>
                <div className="border-b p-2 text-sm">{edu.instituteName}</div>
                <div className="border-b p-2 text-sm">
                  {edu.startDate ? format(parse(edu.startDate, 'yyyy-MM-dd', new Date()), 'PPP') : '-'}
                </div>
                <div className="border-b p-2 text-sm">
                  {edu.completionDate ? format(parse(edu.completionDate, 'yyyy-MM-dd', new Date()), 'PPP') : '-'}
                </div>
                <div className="border-b p-2 text-sm">{edu.instituteAddress}</div>
              </div>
            </div>

            {index < educationData.length - 1 && (
              <div className="border-t border-muted my-6" />
            )}
          </div>
        ))}

        <div className="flex justify-center lg:justify-end pt-4">
          <Button className="w-full lg:w-auto">Edit Educational Info</Button>
        </div>
      </CardContent>
    </Card>
  );
}

