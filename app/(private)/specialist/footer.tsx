import { Copyright } from 'lucide-react';

export default function Footer() {
  return (
    <div className="bg-foreground py-3 mb-2 rounded-md">
      <div className="container px-4">
        <p className="text-center text-background text-sm flex items-center justify-center gap-1">
          <Copyright className="w-4 h-4" />
          Copyrights 2024, All Rights Reserved
        </p>
      </div>
    </div>
  );
}

