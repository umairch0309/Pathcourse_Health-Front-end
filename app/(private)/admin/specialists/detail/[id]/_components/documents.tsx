import Image from 'next/image';
import { Typography } from '@/components/ui/typography';

export default function ProfessionalDocuments() {
  const documents = [
    {
      section: '',
      items: [
        { label: 'Resume', file: 'filename.pdf' },
        { label: 'Malpractice insurance', file: 'filename.pdf' },
        { label: 'W9 form', file: 'filename.pdf' },
      ],
    },
    {
      section: 'Other attachments',
      items: [{ label: 'Other', file: 'filename.pdf' }],
    },
    {
      section: 'Other affiliations',
      items: [
        { label: 'Other', file: 'filename.pdf' },
        { label: 'Other', file: 'filename.pdf' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
        {documents[0].items.map((doc, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{doc.label}</div>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src="/pdf.svg"
                alt="pdf"
                width={40}
                height={40}
              />
              <div className="text-sm text-foreground">
                {doc.file}
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.slice(1).map((section, idx) => (
        <div key={idx}>
          <Typography variant="span" className="font-bold text-foreground">
            {section.section}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
            {section.items.map((doc, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="text-xs text-muted-foreground">{doc.label}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Image
                    src="/pdf.svg"
                    alt="pdf"
                    width={40}
                    height={40}
                  />
                  <div className="text-sm text-foreground">
                    {doc.file}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}