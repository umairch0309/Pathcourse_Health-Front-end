'use client';

import { useEffect } from 'react';
import {
  LayoutGrid,
  Users,
  User,
  Calendar,
  Settings,
  Heart,
  Wallet,
  MailQuestion,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    href: '/admin',
  },
  {
    title: 'Specialists',
    icon: Users,
    href: '/admin/specialists',
  },
  {
    title: 'Users',
    icon: User,
    href: '/admin/users',
  },
  {
    title: 'Sessions',
    icon: Calendar,
    href: '/admin/sessions',
  },
  {
    title: 'Services',
    icon: Heart,
    href: '/admin/services',
  },
  {
    title: 'Transactions',
    icon: Wallet,
    href: '/admin/transactions',
  },
  {
    title: 'User Inquiries',
    icon: MailQuestion,
    href: '/admin/user-inquiries',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Close mobile sidebar when pathname changes
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar
      variant="floating"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-muted-foreground mb-2">Your Profile Access To</SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                // For Dashboard, only match exact path. For others, match exact or sub-paths
                const isActive = item.href === '/admin'
                  ? pathname === item.href || pathname === item.href + '/'
                  : pathname === item.href || pathname?.startsWith(item.href + '/');
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'w-full justify-start gap-3',
                        'hover:bg-foreground hover:text-background',
                        'data-[active=true]:bg-foreground data-[active=true]:text-background',
                        isActive && '!bg-foreground !text-background'
                      )}
                    >
                      <Link href={item.href as any}>
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

