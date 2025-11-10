/* eslint-disable unused-imports/no-unused-vars */
'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import FormModified from '@/components/ui/form-modified';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

const signupSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Password must be at least 6 characters'),
    agree: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Passwords don\'t match',
    path: ['confirm_password'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (data: SignupFormData) => {
    console.log('Signup data:', data);
    router.push('/role-selection');
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <Typography as="h3" variant="h5" className="text-xl font-bold sm:text-2xl text-primary">
            <span className="text-foreground">Welcome Back To,</span>
            {' '}
            Path Course Health
          </Typography>
          <Typography variant="span" className="text-foreground">
            Welcome back! Please enter your details.
          </Typography>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
              <span className="hidden sm:inline">Continue with Google</span>
              <span className="sm:hidden">Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('facebook')}
            >
              <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
              <span className="hidden sm:inline">Continue with Facebook</span>
              <span className="sm:hidden">Facebook</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs">
              <Typography variant="span" className="text-muted-foreground bg-background px-2">
                or
              </Typography>
            </div>
          </div>

          <FormModified
            schema={signupSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              confirm_password: '',
              agree: false,
            }}
          >
            {({ components }) => (
              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <components.Input 
                    name="first_name" 
                    label="First Name" 
                    placeholder="John"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />
                  <components.Input 
                    name="last_name" 
                    label="Name" 
                    placeholder="Doe"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />
                </div>

                <components.Input 
                  name="email" 
                  label="Email" 
                  type="email" 
                  placeholder="Email"
                  labelClassName="text-xs text-muted-foreground mb-2"
                />

                <div className="space-y-2">
                  <components.Field 
                    name="password" 
                    label="Password"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  >
                    {field => (
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="flex h-9 w-full rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors duration-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </components.Field>
                </div>

                <div className="space-y-2">
                  <components.Field 
                    name="confirm_password" 
                    label="Confirm Password"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  >
                    {field => (
                      <div className="relative">
                        <input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm Password"
                          className="flex h-9 w-full rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors duration-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </components.Field>
                </div>

                <div className="flex items-start sm:items-center justify-between">
                  <components.Field name="agree">
                    {field => (
                      <div className="flex items-start sm:items-center space-x-2">
                        <Checkbox
                          id="agree"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-black mt-0.5 sm:mt-0"
                        />
                        <Typography variant="span" className="text-foreground/90">
                          I agree with
                          {' '}
                          <span className="text-primary">Terms & Conditions</span>
                        </Typography>
                      </div>
                    )}
                  </components.Field>
                </div>

                <Button type="submit" size="lg" className="flex mx-auto w-full lg:w-[350px] sm:w-auto">
                  Sign Up
                </Button>
              </div>
            )}
          </FormModified>

          <div className="text-center">
            <Typography variant="span" className="text-foreground/60">
              Have an account? {' '}
              {' '}
              <Link href="/auth/login">
                <span className='font-bold hover:underline text-foreground'>Login</span>
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}