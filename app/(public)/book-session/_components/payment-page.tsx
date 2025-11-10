'use client';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type PaymentPageProps = {
  duration?: number;
  onBack?: () => void;
  onContinue?: () => void;
};

const durationPrices: Record<number, number> = {
  15: 25,
  30: 55,
  45: 70,
  60: 90,
};

export default function PaymentPage({ duration, onBack, onContinue }: PaymentPageProps) {
  const price = duration ? durationPrices[duration] : 0;

  return (
    <section className="bg-background min-h-screen pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <Typography variant="h3" className="text-foreground font-bold mb-8 text-center">
          Confirm Payment
        </Typography>

        {/* Payment Details */}
        <div className="bg-muted rounded-2xl p-8 mb-8 space-y-6">
          {duration && price > 0 ? (
            <>
              <div className="text-center">
                <Typography variant="p" className="text-foreground mb-2">
                  You will be charged this amount for choosing this duration:
                </Typography>
                <Typography variant="h2" className="text-foreground font-bold">
                  ${price.toFixed(2)}
                </Typography>
                <Typography variant="span" className="text-muted-foreground">
                  for {duration} minutes session
                </Typography>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <Typography variant="p" className="text-foreground text-center text-sm">
                  Payment processing will be handled securely through Stripe. Your payment
                  information will be encrypted and processed in a secure environment.
                </Typography>
                <Typography variant="span" className="text-foreground text-center text-sm block">
                  Click "Pay Now" to proceed with the booking. You will be redirected to complete
                  the payment process.
                </Typography>
              </div>
            </>
          ) : (
            <Typography variant="p" className="text-foreground text-center">
              No duration selected. Please go back and select a session duration.
            </Typography>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={onBack}>
            Back
          </Button>
          <Button variant="default" size="lg" onClick={onContinue} disabled={!duration || price === 0}>
            Pay Now
          </Button>
        </div>
      </div>
    </section>
  );
}

