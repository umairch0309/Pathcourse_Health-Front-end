import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export default function ManageAccount() {
  return (
    <div className="p-4 lg:p-2 w-full max-w-[345px] lg:max-w-none mx-auto">
      <Typography variant="p" className="mb-2 text-lg lg:text-xl font-bold text-foreground">
        Manage Account
      </Typography>
      <Typography variant="span" className="text-sm lg:text-base text-muted-foreground">
        Select option what you want to do your account?
      </Typography>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-2 mt-8 lg:mt-12 w-full">
        <Button variant="default" className="w-full lg:w-auto text-background">
          Delete Account
        </Button>
        <Button variant="outline" className="w-full lg:w-auto text-bold border-primary">
          Hibernate Account
        </Button>
      </div>
    </div>
  );
}

