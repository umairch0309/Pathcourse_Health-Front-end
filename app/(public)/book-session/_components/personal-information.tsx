'use client';
import { CloudUpload } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import ConsentModal from './consent-modal';
import FormModified from '@/components/ui/form-modified';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';

// Form schema
const personalInfoSchema = z.object({
  sessionFor: z.string().min(1, 'Session for is required'),
  userName: z.string().min(1, 'User name is required'),
  relationWithUser: z.string().optional(),
  age: z.string().optional().or(z.literal('')),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  firstVisit: z.string().optional(),
  takingMedicine: z.string().optional(),
  preCondition: z.string().optional(),
  currentCondition: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

type PersonalInformationProps = {
  onContinue: (data: PersonalInfoFormData) => void;
  onBack?: () => void;
};

export default function PersonalInformation({ onContinue, onBack }: PersonalInformationProps) {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoFormData | null>(null);

  const inputClassName = "w-full px-0 py-3 text-sm text-foreground placeholder-muted-foreground placeholder:text-sm bg-transparent border-0 border-b-2 border-border rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300";
  const selectClassName = "w-full px-0 py-3 text-sm text-foreground border-0 border-b-2 border-border rounded-none focus:border-primary focus-visible:ring-0 focus-visible:outline-0 transition-colors duration-300";

  const handleFormSubmit = (values: PersonalInfoFormData) => {
    setFormData(values);
    setIsConsentModalOpen(true);
  };

  const handleConsentAgree = () => {
    setIsConsentModalOpen(false);
    if (formData) {
      onContinue(formData);
    }
  };

  return (
    <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-25">
      <div>
        {/* Title */}
        <Typography variant="h3" className="text-foreground font-bold mb-8 text-center">
          Fill your personal and medical information
        </Typography>

        <FormModified
          schema={personalInfoSchema}
          onSubmit={handleFormSubmit}
          defaultValues={{
            sessionFor: undefined,
            userName: '',
            relationWithUser: '',
            age: undefined,
            email: '',
            phone: '',
            address: '',
            country: '',
            state: '',
            city: '',
            zipCode: '',
            firstVisit: '',
            takingMedicine: '',
            preCondition: '',
            currentCondition: '',
          }}
        >
          {({ methods, components }) => {
            const watchSessionFor = methods.watch('sessionFor');
            
            return (
              <div className="space-y-8">
                {/* Session for */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                <components.Field
                  name="sessionFor"
                  label="Session for"
                  labelClassName="text-sm font-medium text-muted-foreground mb-2"
                >
                  {(field) => {
                    if (!field) return null;
                    return (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value ? String(field.value) : undefined}
                      >
                        <SelectTrigger className={selectClassName}>
                          <SelectValue placeholder="Session for" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="me">Me</SelectItem>
                          <SelectItem value="someone else">Someone else</SelectItem>
                        </SelectContent>
                      </Select>
                    );
                  }}
                </components.Field>
                </div>

                {/* User Info Section */}
                <div>
                  <Typography variant="h5" className="text-foreground font-bold mb-4">
                    User Info
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <components.Input
                      name="userName"
                      label="User name"
                      placeholder="User name"
                      labelClassName="text-sm font-medium text-muted-foreground"
                      className={inputClassName}
                    />

                    {watchSessionFor === 'someone else' && (
                      <components.Input
                        name="relationWithUser"
                        label="Relation with User"
                        placeholder="Relation with User"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                    )}

                    <components.Field
                      name="age"
                      label="Age"
                      labelClassName="text-sm font-medium text-muted-foreground mb-2"
                    >
                      {(field) => {
                        if (!field) return null;
                        return (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ? String(field.value) : undefined}
                          >
                            <SelectTrigger className={selectClassName}>
                              <SelectValue placeholder="Age" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                                <SelectItem key={age} value={age.toString()}>
                                  {age}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    </components.Field>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div>
                  <Typography variant="h5" className="text-foreground font-bold mb-4">
                    Contact Info
                  </Typography>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <components.Input
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                      <components.Input
                        name="phone"
                        label="Phone"
                        type="tel"
                        placeholder="Phone"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                    </div>
                    <components.Input
                      name="address"
                      label="Address"
                      placeholder="Address"
                      labelClassName="text-sm font-medium text-muted-foreground"
                      className={inputClassName}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <components.Input
                        name="country"
                        label="Country"
                        placeholder="Country"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                      <components.Input
                        name="state"
                        label="State"
                        placeholder="State"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                      <components.Input
                        name="city"
                        label="City"
                        placeholder="City"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                      <components.Input
                        name="zipCode"
                        label="Zip Code"
                        placeholder="Zip Code"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Details Section */}
                <div>
                  <Typography variant="h5" className="text-foreground font-bold mb-4">
                    Medical Details
                  </Typography>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <components.Input
                        name="firstVisit"
                        label="Is this your first visit?"
                        placeholder="Is this your first visit?"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                      <components.Input
                        name="takingMedicine"
                        label="Are you taking any medicine?"
                        placeholder="Are you taking any medicine?"
                        labelClassName="text-sm font-medium text-muted-foreground"
                        className={inputClassName}
                      />
                    </div>
                    <components.Input
                      name="preCondition"
                      label="Pre condition"
                      placeholder="Pre condition"
                      labelClassName="text-sm font-medium text-muted-foreground"
                      className={inputClassName}
                    />
                    <components.Input
                      name="currentCondition"
                      label="Current condition"
                      placeholder="Current condition"
                      labelClassName="text-sm font-medium text-muted-foreground"
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Reports Section */}
                <div>
                  <Typography variant="h5" className="text-foreground font-bold mb-4">
                    Reports
                  </Typography>
                  <label htmlFor="file-upload">
                    <div className="border-2 lg:w-1/5 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                      <CloudUpload className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                      <Typography variant="p" className="text-foreground font-medium mb-1">
                        Upload file
                      </Typography>
                      <Typography variant="span" className="text-muted-foreground text-sm">
                        Max file size 50mb
                      </Typography>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" size="lg" type="button" onClick={onBack}>
                    Back
                  </Button>
                  <Button variant="default" size="lg" type="submit">
                    Continue
                  </Button>
                </div>
              </div>
            );
          }}
        </FormModified>

        <ConsentModal
          open={isConsentModalOpen}
          onClose={() => setIsConsentModalOpen(false)}
          onAgree={handleConsentAgree}
        />
      </div>
    </section>
  );
}

