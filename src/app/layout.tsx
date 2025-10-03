
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { getBusiness, getCurrentUser } from '@/lib/actions';
import { headers } from 'next/headers';
import { getSession } from '@/lib/session';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export async function generateMetadata(): Promise<Metadata> {
  const heads = headers();
  const pathname = heads.get('next-url') || '';
  const session = await getSession();

  // For dashboard pages, get the business name from the logged-in user
  if (pathname.startsWith('/dashboard') && session) {
    const user = await getCurrentUser();
    if(user && user.businessId) {
        const business = await getBusiness(user.businessId);
        if (business) {
            return {
                title: `${business.name} | Dashboard`,
                description: `Dashboard for ${business.name}.`,
            };
        }
    }
    return {
        title: 'Business Dashboard',
        description: 'Manage your business seamlessly.',
    };
  }
  
  // For the public review page, get business name from query param
  if (pathname.startsWith('/review')) {
    const url = new URL(pathname, `https://${heads.get('host')}`);
    const businessId = url.searchParams.get('bid');
    if (businessId) {
      const business = await getBusiness(businessId);
      if (business) {
        return {
          title: `Leave a Review for ${business.name}`,
          description: `Share your feedback for ${business.name}.`,
        };
      }
    }
  }

  return {
    title: 'Review Router',
    description: 'The All-In-One Platform to Grow Your Local Business.',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          fontInter.variable,
          fontHeadline.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
