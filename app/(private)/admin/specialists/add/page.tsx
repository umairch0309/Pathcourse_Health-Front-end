'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import FormModified from '@/components/ui/form-modified';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';

const addDoctorSchema = z
  .object({
    specialistName: z.string().min(1, 'Specialist name is required'),
    email: z.string().email('Invalid email address'),
    contactNo: z.string().min(1, 'Contact number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
    credentialsEmail: z.string().email('Invalid email address').optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  });

type AddDoctorFormData = z.infer<typeof addDoctorSchema>;

export default function AddDoctorForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: AddDoctorFormData) => {
    console.log('Signup data:', { ...data });
    setShowInvitationModal(true);
  };

  const handleModalClose = () => {
    setShowInvitationModal(false);
    handleCancel();
  };

  return (
    <>
      <div>
        <Typography variant="h5" className="font-bold text-foreground mb-4">Add Specialist</Typography>
        <div className=" bg-background p-6 rounded-md">
          <div>
            <FormModified
              schema={addDoctorSchema}
              onSubmit={handleSubmit}
              defaultValues={{
                specialistName: '',
                email: '',
                contactNo: '',
                password: '',
                confirmPassword: '',
                credentialsEmail: '',
              }}
            >
              {({ components }) => (
                <div className="space-y-6">
                  <div>
                    <Typography variant="p" className="font-bold text-foreground mb-2">Specialist Info</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <components.Input name="specialistName" label="Specialist name" placeholder="Specialist Name" />
                      <components.Input name="email" label="Email" type="email" placeholder="Email" />
                      <components.Input name="contactNo" label="Contact no." placeholder="(321) 123-456" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                      <components.Field name="password" label="Password">
                        {field => (
                          <div className="relative">
                            <Input {...field} type={showPassword ? 'text' : 'password'} placeholder="password" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        )}
                      </components.Field>
                      <components.Field name="confirmPassword" label="Confirm password">
                        {field => (
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="confirm password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        )}
                      </components.Field>
                    </div>
                  </div>

                  <div>
                    <Typography variant="p" className="font-bold text-foreground mb-2">Send Credentials On</Typography>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <components.Input name="credentialsEmail" placeholder="Specialist personal email" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Send Invite Link
                    </Button>
                  </div>
                </div>
              )}
            </FormModified>
          </div>
        </div>
      </div>
      <Dialog open={showInvitationModal} onOpenChange={setShowInvitationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Invitation Sent</DialogTitle>
          </DialogHeader>
          <Typography variant="span" className="mb-4 lg:mb-6 text-foreground">Invitation sent has been to successfully to the Doctor.</Typography>
          <DialogFooter>
            <Button onClick={handleModalClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  );
}