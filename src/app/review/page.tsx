
'use client';
import { ReviewForm } from '@/components/landing/review-form';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { Business } from '@/lib/types';
import { getBusiness } from '@/lib/actions';

function ReviewPageHeader({ business }: { business: Business | null }) {
    if (!business) {
        return (
            <div className="flex items-center justify-center h-full">
                {/* Render nothing or a non-branded loader */}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center gap-2">
            {business.logoUrl ? (
                 <div className="relative w-10 h-10">
                    <Image 
                        src={business.logoUrl} 
                        alt={`${business.name} Logo`} 
                        fill
                        className="object-contain"
                    />
                </div>
            ) : null}
            <span className="font-headline text-xl font-bold">{business.name}</span>
        </div>
    )
}

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('bid');
  const [business, setBusiness] = useState<Business | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(businessId) {
      getBusiness(businessId).then(biz => {
        setBusiness(biz);
        setLoading(false);
      });
    } else {
      setBusiness(null);
      setLoading(false);
    }
  }, [businessId]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <header className="px-4 lg:px-6 h-16 flex items-center bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
            <ReviewPageHeader business={business} />
        </header>
        <main className="flex-1 flex items-center justify-center py-12 px-4">
            <div className="container px-0 flex justify-center">
                {loading ? (
                    <Card className="w-full max-w-lg shadow-2xl">
                        <CardContent className="p-8 flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin" />
                            <span>Loading business details...</span>
                        </CardContent>
                    </Card>
                ) : !businessId || !business ? (
                    <ReviewForm businessId={null} />
                ) : business.status !== 'active' ? (
                    <Card className="w-full max-w-lg shadow-2xl">
                        <CardHeader className="text-center items-center">
                            {business?.logoUrl && (
                                <div className="flex justify-center mb-4">
                                    <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={100} className="rounded-full object-contain"/>
                                </div>
                            )}
                            <div className="flex justify-center">
                                <AlertTriangle className="size-12 text-destructive mb-4" />
                            </div>
                            <CardTitle className="text-2xl font-headline">Unable to Leave Feedback</CardTitle>
                            <CardDescription>
                                This business is not currently accepting new reviews.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">
                                If you'd like to share your feedback, please contact {business.name} directly. We apologize for any inconvenience.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="w-full max-w-lg text-center">
                        {business?.logoUrl && (
                            <div className="flex justify-center mb-8">
                                <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={100} className="rounded-full object-contain border p-1 shadow-sm"/>
                            </div>
                        )}
                        <ReviewForm businessId={businessId} business={business} />
                    </div>
                )}
            </div>
        </main>
        <footer className="flex items-center justify-center w-full h-24 border-t bg-card">
            <p className="text-muted-foreground text-center px-4 text-sm">Powered by Grow Lead Spot</p>
        </footer>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center">
            <Loader2 className="animate-spin size-8 text-muted-foreground" />
        </div>
    }>
        <ReviewPageContent />
    </Suspense>
  );
}
