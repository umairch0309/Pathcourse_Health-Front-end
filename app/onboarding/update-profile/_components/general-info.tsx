'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormModified from '@/components/ui/form-modified';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/typography';

const generalInfoSchema = z.object({
  profession: z.string().min(1, 'Profession is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  language: z.string().min(1, 'Language is required'),
  fundingOptions: z.string().min(1, 'Funding options are required'),
  serviceDelivery: z.string().min(1, 'Service delivery is required'),
  specialInterest: z.string().min(1, 'Special interest area is required'),
  resume: z.custom<FileList>(val => val instanceof FileList && val.length > 0, {
    message: 'Please upload resume',
  }),
  malpractice: z.custom<FileList>(val => val instanceof FileList && val.length > 0, {
    message: 'Please upload malpractice insurance',
  }),
  telemedicineCertificate: z.custom<FileList>(val => val instanceof FileList && val.length > 0, {
    message: 'Please upload telemedicine privilege certificate',
  }),
  medicalLicense: z.custom<FileList>(val => val instanceof FileList && val.length > 0, {
    message: 'Please upload medical license',
  }),
  otherAttachments: z.any().optional(),
  affiliations: z.any().optional(),
});

type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export default function GeneralInfo() {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});

  const router = useRouter();

  const handleSubmit = (values: GeneralInfoValues) => {
    console.log('Form Values:', values);
    console.log('Uploaded Files:', uploadedFiles);
    setOpen(true); // This should now work
  };

  const handleFileUpload = (fieldName: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...fileArray],
      }));
    }
  };

  const handleFileRemove = (fieldName: string, fileIndex: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_, index) => index !== fileIndex) || [],
    }));
  };

  const documentFields = [
    { name: 'resume', label: 'Upload resume' },
    { name: 'malpractice', label: 'Upload malpractice insurance' },
    { name: 'telemedicineCertificate', label: 'Telemedicine privilege certificate' },
    { name: 'medicalLicense', label: 'Medical License' },
    {
      name: 'otherAttachments',
      label: 'Upload other attachments (Can add multiple as well) label the attachment as well',
    },
    { name: 'affiliations', label: 'Other affiliations' },
  ] as const;

  return (
    <>
      <FormModified
        schema={generalInfoSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          profession: '',
          ageGroup: '',
          language: '',
          fundingOptions: '',
          serviceDelivery: '',
          specialInterest: '',
        }}
      >
        {({ components, methods }) => (
          <div className="space-y-8">
            <Typography variant="p" className="font-bold text-foreground">
              General Info
            </Typography>

            <div className="grid lg:grid-cols-3 gap-4">
              <components.Input
                name="profession"
                placeholder="Profession"
                label="Profession"
                className="border-b p-2"
              />
              <components.Input name="ageGroup" placeholder="Age group" label="Age group" className="border-b p-2" />
              <components.Input name="language" placeholder="Language" label="Language" className="border-b p-2" />
            </div>
            <div className='grid lg:grid-cols-3 gap-4'>
              <components.Input
                name="fundingOptions"
                placeholder="Funding options"
                label="Funding options"
                className="border-b p-2"
              />
              <components.Input
                name="serviceDelivery"
                placeholder="Service delivery"
                label="Service delivery"
                className="border-b p-2"
              />
              </div>

            <components.Input
              name="specialInterest"
              placeholder="Special interest area"
              label="Special interest area"
              className="border-b p-2"
            />

            <Typography variant="p" className="font-bold text-foreground">
              Upload Documents
            </Typography>

            <div className="space-y-4">
              {documentFields.map(({ name, label }) => (
                <div key={name} className="space-y-2">
                  <div className="grid lg:grid-cols-2 pb-2 items-start">
                    <span>{label}</span>
                    <div className="flex items-start gap-3 w-full">
                      <components.Field name={name as any}>
                        {field => (
                          <>
                            <Label htmlFor={`file-${name}`} className="inline-flex">
                              <div className="bg-muted rounded-md">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="flex items-center gap-2 bg-muted"
                                  onClick={() => document.getElementById(`file-${name}`)?.click()}
                                >
                                  <Image src="/upload.svg" alt="image" width={20} height={20} />
                                  <span className="text-foreground font-bold">Upload</span>
                                </Button>
                              </div>
                            </Label>
                            <Input
                              id={`file-${name}`}
                              type="file"
                              className="hidden"
                              multiple={name === 'otherAttachments'}
                              onChange={e => {
                                field.onChange(e.target.files as unknown as FileList);
                                handleFileUpload(name as any, e.target.files);
                              }}
                            />
                          </>
                        )}
                      </components.Field>

                      <div className="flex-1 min-w-0">
                        {uploadedFiles[name] && uploadedFiles[name].length > 0 && (
                          <div className="max-w-full space-y-1">
                            {uploadedFiles[name].map((file, index) => (
                              <components.Field key={`${name}-${index}`} name={name as any}>
                                {field => (
                                  <div className="flex items-center justify-between bg-muted/50 rounded px-3 py-2 text-sm">
                                    <span className="truncate pr-2">{file.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        handleFileRemove(name as any, index);
                                        if (name !== 'otherAttachments') {
                                          field.onChange(undefined as unknown as FileList);
                                        }
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </components.Field>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/specialist')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Save Profile
              </Button>
            </div>
          </div>
        )}
      </FormModified>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Profile Updated</DialogTitle>
            <DialogDescription>
              Congratulations! Your profile details has been updated successfully. Now your profile is under review. You'll be notified soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpen(false);
                router.push('/specialist');
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

