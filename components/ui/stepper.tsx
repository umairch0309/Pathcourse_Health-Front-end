/* eslint-disable react-dom/no-missing-button-type */
/* eslint-disable jsx-a11y/heading-has-content */
'use client';

import { Slot } from '@radix-ui/react-slot';
import {
  CheckIcon,
  Grip,
  LoaderCircleIcon,
  LockIcon,
} from 'lucide-react';
import * as React from 'react';
import { createContext, use } from 'react';
import { cn } from '@/lib/utils';

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: 'horizontal' | 'vertical';
  nextStep: () => void;
  prevStep: () => void;
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = 'pending' | 'in-progress' | 'completed';

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(
  undefined,
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined,
);

const useStepper = () => {
  const context = use(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a Stepper');
  }
  return context;
};

const useStepItem = () => {
  const context = use(StepItemContext);
  if (!context) {
    throw new Error('useStepItem must be used within a StepperItem');
  }
  return context;
};

// Stepper Component
type StepperProps = {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>;

function Stepper({
  defaultValue = 0,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: StepperProps) {
  const [activeStep, setInternalStep] = React.useState(defaultValue);

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange],
  );

  const currentStep = value ?? activeStep;

  const nextStep = React.useCallback(() => {
    setActiveStep(currentStep + 1);
  }, [currentStep, setActiveStep]);

  const prevStep = React.useCallback(() => {
    if (currentStep > 0) {
      setActiveStep(currentStep - 1);
    }
  }, [currentStep, setActiveStep]);

  return (
    <StepperContext
      value={{
        activeStep: currentStep,
        setActiveStep,
        orientation,
        nextStep,
        prevStep,
      }}
    >
      <div
        data-slot="stepper"
        className={cn(
          'group/stepper flex flex-col gap-8',
          orientation === 'horizontal' ? 'w-full' : 'flex-col',
          className,
        )}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext>
  );
}

// StepperItem
type StepperItemProps = {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState
        = completed || step < activeStep
          ? 'completed'
          : activeStep === step
            ? 'in-progress'
            : 'pending';

  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        data-slot="stepper-item"
        className={cn(
          'group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col text-center gap-2',
          className,
        )}
        data-state={state}
        {...(isLoading ? { 'data-loading': true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext>
  );
}

// StepperTrigger
type StepperTriggerProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function StepperTrigger({
  asChild = false,
  className,
  children,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, isDisabled } = useStepItem();

  if (asChild) {
    const Comp = Slot;
    return (
      <Comp data-slot="stepper-trigger" className={className} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <button
      data-slot="stepper-trigger"
      className={cn(
        'focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-full focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      onClick={() => setActiveStep(step)}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}

// StepperIndicator
type StepperIndicatorProps = {
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function StepperIndicator({
  asChild = false,
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { state, isLoading } = useStepItem();

  return (
    <span
      data-slot="stepper-indicator"
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-all',
        'border-muted bg-background text-muted-foreground',
        'data-[state=in-progress]:border-primary data-[state=in-progress]:bg-transparent data-[state=in-progress]:text-primary',
        'data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-background',
        className,
      )}
      data-state={state}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {state === 'in-progress' && (
            <Grip size={16} aria-hidden="true" />
          )}
          {state === 'completed' && <CheckIcon size={16} aria-hidden="true" />}
          {state === 'pending' && <LockIcon size={16} aria-hidden="true" />}

          {isLoading && (
            <span className="absolute">
              <LoaderCircleIcon
                className="animate-spin"
                size={14}
                aria-hidden="true"
              />
            </span>
          )}
        </>
      )}
    </span>
  );
}

// StepperTitle
function StepperTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="stepper-title"
      className={cn('text-sm font-medium', className)}
      {...props}
    />
  );
}

// StepperDescription
function StepperDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="stepper-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// StepperStatusLabel
function StepperStatusLabel() {
  const { state } = useStepItem();

  const statusMap: Record<StepState, { label: string; className: string }> = {
    'completed': { label: 'Completed', className: 'bg-green-100 text-green-700' },
    'in-progress': {
      label: 'In-Progress',
      className: 'bg-blue-100 text-blue-700',
    },
    'pending': { label: 'Pending', className: 'bg-gray-100 text-gray-500' },
  };

  const status = statusMap[state];

  return (
    <span
      className={cn(
        'mt-1 rounded-full px-2 py-0.5 text-xs font-medium',
        status.className,
      )}
    >
      {status.label}
    </span>
  );
}

// StepperSeparator
function StepperSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stepper-separator"
      className={cn(
        'bg-muted group-data-[state=completed]/step:bg-primary m-0.5 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5',
        className,
      )}
      {...props}
    />
  );
}

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperStatusLabel,
  StepperTitle,
  StepperTrigger,
  useStepper,
};