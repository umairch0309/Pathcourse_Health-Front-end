/* eslint-disable unused-imports/no-unused-vars */
'use client';

import { Check, X, Eye, EyeOff, Info } from 'lucide-react';
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
import { Loader } from '@/components/loader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import auth from '@/lib/auth';
import useToast from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const signupSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirm_password: z.string().min(8, 'Password must be at least 8 characters'),
    agree: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Passwords don\'t match',
    path: ['confirm_password'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
  { label: 'One special character', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
];

function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} {
  if (!password) return { strength: 'weak', score: 0 };
  
  const metRequirements = passwordRequirements.filter(req => req.test(password)).length;
  const score = metRequirements;
  
  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
}

export default function SignupPage() {
  const router = useRouter();
  const { toastError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      // Combine first_name and last_name into name for the API
      const result = await auth.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: `${data.first_name} ${data.last_name}`.trim(),
        },
        {
          onSuccess(context) {
            router.refresh();
            console.log('Sign-up successful:', context);
            // @ts-expect-error - Next.js route type inference issue
            router.push('/onboarding/role-selection');
          },
        }
      );
      console.log('Sign-up result:', result);
      
      // Check if result has an error
      if (result?.error) {
        const errorMessage = result.error.message || 'An error occurred during sign up';
        toastError(errorMessage);
      }
    } catch (error: any) {
      console.error('Sign-up error:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Credentials not matched.';
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
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
                    label="Last Name" 
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
                      <div className="space-y-2 w-full">
                        <div className="relative">
                          <input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            onChange={(e) => {
                              field.onChange(e);
                              setPassword(e.target.value);
                            }}
                            onBlur={() => setShowPasswordRequirements(false)}
                            className="flex h-9 w-full rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 pr-20 transition-colors duration-300"
                          />
                          <div className="absolute right-0 top-0 h-full flex items-center gap-1">
                            {password && (
                              <Popover open={showPasswordRequirements} onOpenChange={setShowPasswordRequirements}>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-full px-2 py-1 hover:bg-transparent text-muted-foreground"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowPasswordRequirements(!showPasswordRequirements);
                                    }}
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                              <PopoverContent className="w-64 p-3" align="end" side="bottom">
                                <div className="space-y-2">
                                  {password && (
                                    <div className="space-y-2 pb-2 border-b">
                                      <div className="flex items-center justify-between">
                                        <Typography variant="span" className="text-xs text-muted-foreground">
                                          Password strength:
                                        </Typography>
                                        <Typography 
                                          variant="span" 
                                          className={cn(
                                            'text-xs font-medium',
                                            getPasswordStrength(password).strength === 'weak' && 'text-destructive',
                                            getPasswordStrength(password).strength === 'medium' && 'text-yellow-600 dark:text-yellow-500',
                                            getPasswordStrength(password).strength === 'strong' && 'text-green-600 dark:text-green-500'
                                          )}
                                        >
                                          {getPasswordStrength(password).strength.charAt(0).toUpperCase() + getPasswordStrength(password).strength.slice(1)}
                                        </Typography>
                                      </div>
                                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                          className={cn(
                                            'h-full transition-all duration-300',
                                            getPasswordStrength(password).strength === 'weak' && 'bg-destructive w-1/3',
                                            getPasswordStrength(password).strength === 'medium' && 'bg-yellow-600 dark:bg-yellow-500 w-2/3',
                                            getPasswordStrength(password).strength === 'strong' && 'bg-green-600 dark:bg-green-500 w-full'
                                          )}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <div className="space-y-1.5">
                                    <Typography variant="span" className="text-xs font-medium text-foreground">
                                      Password requirements:
                                    </Typography>
                                    <div className="space-y-1.5">
                                      {passwordRequirements.map((requirement, index) => {
                                        const isMet = password ? requirement.test(password) : false;
                                        return (
                                          <div key={index} className="flex items-center gap-2">
                                            {isMet ? (
                                              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                                            ) : (
                                              <X className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                            )}
                                            <Typography
                                              variant="span"
                                              className={cn(
                                                'text-xs',
                                                isMet
                                                  ? 'text-green-600 dark:text-green-500'
                                                  : 'text-muted-foreground'
                                              )}
                                            >
                                              {requirement.label}
                                            </Typography>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                              </Popover>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-full px-2 py-1 hover:bg-transparent text-muted-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
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

                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex mx-auto w-full lg:w-[350px] sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size="sm" variant="default" color="white" className="mr-2" />
                    </>
                  ) : (
                    'Sign Up'
                  )}
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