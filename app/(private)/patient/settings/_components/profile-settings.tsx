"use client";
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const userInfo = {
  name: 'Emelie Alexander',
  email: 'emelie.alexander38@gmail.com',
  phone: '+1 (234) 567-8900',
  gender: 'Female',
  address: 'New York, United States',
};

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>
          <div className='text-foreground font-bold'>Profile Settings</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 lg:space-y-8">
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            <Avatar className="size-24 lg:size-30">
              <AvatarImage src={previewUrl ?? '/avatar.svg?height=96&width=96'} alt="Profile photo" />
              <AvatarFallback>EA</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="default"
              className="absolute -bottom-1 -right-1 size-10 rounded-full p-0 border-2 border-background"
              onClick={handlePickImage}
            >
              <Camera className="h-5 w-5 text-foreground" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 lg:mb-6 font-semibold text-foreground">General Info</div>

          <div className="block lg:hidden space-y-4">
            <div>
              <div className="text-foreground mb-2">Name</div>
              <div className="text-muted-foreground border-b pb-2">{userInfo.name}</div>
            </div>
            <div>
              <div className="text-foreground mb-2">Email</div>
              <div className="text-muted-foreground border-b pb-2">{userInfo.email}</div>
            </div>
            <div>
              <div className="text-foreground mb-2">Date of birth</div>
              <div className="text-muted-foreground border-b pb-2">{userInfo.phone}</div>
            </div>
            <div>
              <div className="text-foreground mb-2 font-medium">Gender</div>
              <div className="text-muted-foreground border-b pb-2">{userInfo.gender}</div>
            </div>
            <div>
              <div className="text-foreground mb-2 font-medium">Address</div>
              <div className="text-muted-foreground border-b pb-2">{userInfo.address}</div>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2">
            <div className="space-y-6">
              <div className="text-foreground border-b p-2 font-medium text-sm">Name</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Email</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Date of birth</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Gender</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Address</div>
            </div>
            <div className="space-y-6">
              <div className="border-b p-2 text-sm">{userInfo.name}</div>
              <div className="border-b p-2 text-sm">{userInfo.email}</div>
              <div className="border-b p-2 text-sm">{userInfo.phone}</div>
              <div className="border-b p-2 text-sm">{userInfo.gender}</div>
              <div className="border-b p-2 text-sm">{userInfo.address}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end pt-4">
          <Button className="w-full lg:w-auto">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}