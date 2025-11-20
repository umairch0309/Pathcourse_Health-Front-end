'use client';

import { format, addYears, parse } from 'date-fns';
import { Calendar1, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import FormModified from '@/components/ui/form-modified';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStepper } from '@/components/ui/stepper';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const educationSchema = z.object({
  education: z
    .array(
      z.object({
        degreeTitle: z.string().min(1, 'Degree title is required'),
        instituteName: z.string().min(1, 'Institute name is required'),
        startDate: z.string().min(1, 'Start date is required'),
        completionDate: z.string().min(1, 'Completion date is required'),
        transcript: z.custom<FileList>(val => val instanceof FileList && val.length > 0, {
          message: 'Please upload a transcript/degree',
        }),
        instituteAddress: z.string().min(1, 'Institute address is required'),
      })
      .refine(
        data => {
          if (!data.startDate || !data.completionDate) return true;
          const start = parse(data.startDate, 'yyyy-MM-dd', new Date());
          const completion = parse(data.completionDate, 'yyyy-MM-dd', new Date());
          const minCompletion = addYears(start, 2);
          return completion >= minCompletion;
        },
        {
          message: 'Completion date must be at least 2 years after start date',
          path: ['completionDate'],
        }
      ),
    )
    .min(1, 'At least one education entry is required'),
});

type EducationValues = z.infer<typeof educationSchema>;

export default function EducationalInfo() {
  const { nextStep } = useStepper();
  const [entries, setEntries] = useState([0]);
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState<Record<string, boolean>>({});

  const handleSubmit = (values: EducationValues) => {
    console.log('Education form values:', values);
    nextStep();
  };

  const addAnother = () => {
    setEntries(prev => [...prev, prev.length]);
  };

  const removeEntry = (indexToRemove: number) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter((_, index) => index !== indexToRemove));
      // Clean up calendar state for removed entry
      const newCalendarOpen = { ...calendarOpen };
      delete newCalendarOpen[`start-${indexToRemove}`];
      delete newCalendarOpen[`completion-${indexToRemove}`];
      setCalendarOpen(newCalendarOpen);
    }
  };

  const getCalendarKey = (type: 'start' | 'completion', index: number) => `${type}-${index}`;

  return (
    <FormModified
      schema={educationSchema}
      onSubmit={handleSubmit}
      defaultValues={{
        education: entries.map(() => ({
          degreeTitle: '',
          instituteName: '',
          startDate: '',
          completionDate: '',
          transcript: undefined,
          instituteAddress: '',
        })),
      }}
    >
      {({ components, methods }) => (
        <div className="space-y-6">
          <Typography variant="p" className="font-bold text-foreground">
            Educational
          </Typography>

          {entries.map((entry, index) => (
            <div key={entry} className="space-y-4">

              <div className="grid lg:grid-cols-2 gap-4">
                <components.Input
                  name={`education.${index}.degreeTitle`}
                  placeholder="Degree title"
                  label="Degree title"
                  className="border-b p-2"
                />
                <components.Input
                  name={`education.${index}.instituteName`}
                  placeholder="Institute name"
                  label="Institute name"
                  className="border-b p-2"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-4 items-end">
                <components.Field
                  name={`education.${index}.startDate`}
                  label="Start date"
                  labelClassName="text-sm mb-2"
                >
                  {field => {
                    const startDateValue = field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined;
                    const calendarKey = getCalendarKey('start', index);
                    return (
                      <Popover
                        open={calendarOpen[calendarKey] || false}
                        onOpenChange={(open) => setCalendarOpen(prev => ({ ...prev, [calendarKey]: open }))}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm",
                              !startDateValue && "text-muted-foreground"
                            )}
                          >
                            <span className="truncate">
                              {startDateValue ? format(startDateValue, 'PPP') : 'Select start date'}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDateValue}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                              if (date) {
                                setCalendarOpen(prev => ({ ...prev, [calendarKey]: false }));
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                </components.Field>

                <components.Field
                  name={`education.${index}.completionDate`}
                  label="Completion date"
                  labelClassName="text-sm mb-2"
                >
                  {field => {
                    const completionDateValue = field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined;
                    const calendarKey = getCalendarKey('completion', index);
                    const startDateValue = methods.watch(`education.${index}.startDate`);
                    const minDate = startDateValue ? addYears(parse(startDateValue, 'yyyy-MM-dd', new Date()), 2) : undefined;
                    return (
                      <Popover
                        open={calendarOpen[calendarKey] || false}
                        onOpenChange={(open) => setCalendarOpen(prev => ({ ...prev, [calendarKey]: open }))}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal bg-transparent border-0 border-b-2 border-border rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm",
                              !completionDateValue && "text-muted-foreground"
                            )}
                          >
                            <span className="truncate">
                              {completionDateValue ? format(completionDateValue, 'PPP') : 'Select completion date'}
                            </span>
                            <Calendar1 className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={completionDateValue}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                              if (date) {
                                setCalendarOpen(prev => ({ ...prev, [calendarKey]: false }));
                              }
                            }}
                            disabled={(date) => minDate ? date < minDate : false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                </components.Field>

                <components.Field name={`education.${index}.transcript`}>
                  {field => (
                    <div>
                      <Label htmlFor={`transcript-upload-${index}`} className="flex items-center mb-1 gap-2 cursor-pointer">
                        <Image
                          src="/upload.svg"
                          alt="Upload"
                          width={20}
                          height={20}
                        />
                        Upload transcript/degree
                        <Input
                          id={`transcript-upload-${index}`}
                          type="file"
                          className="hidden"
                          onChange={e => field.onChange(e.target.files)}
                        />
                      </Label>
                    </div>
                  )}
                </components.Field>
              </div>

              <components.Input
                name={`education.${index}.instituteAddress`}
                placeholder="Institute address"
                label="Institute address"
                className="border-b p-2"
              />

              <div className="flex">
                {entries.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeEntry(index)}
                    variant="link"
                    className="text-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Education
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={addAnother}
                  variant="link"
                  className="text-foreground"
                >
                  <Plus className="w-4 h-4" />
                  Add Another
                </Button>
              </div>

            </div>
          ))}

          <div className="flex gap-4 mt-8 mb-4 justify-end">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/specialist')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Continue
            </Button>
          </div>
        </div>
      )}
    </FormModified>
  );
}

