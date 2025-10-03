
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { ArrowLeft, DollarSign, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getBusiness, getReviewsForBusiness } from '@/lib/actions';
import type { Business, Review } from '@/lib/types';

export default async function BusinessDetailsPage({ params }: { params: { id: string } }) {
    const [biz, bizReviews] = await Promise.all([
        getBusiness(params.id),
        getReviewsForBusiness(params.id)
    ]);

    if (!biz) {
        notFound();
    }

  const businessTotalReviews = bizReviews.length;
  const businessAverageRating = businessTotalReviews > 0 
    ? bizReviews.reduce((sum, r) => sum + r.rating, 0) / businessTotalReviews
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/superadmin/dashboard/businesses">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to businesses</span>
          </Link>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">{biz.name}</h1>
        <Badge variant={biz.status === 'active' ? 'secondary' : 'destructive'}>
          {biz.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${biz.subscriptionAmount.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground">
                    {biz.renewsAt ? `Renews on ${format(new Date(biz.renewsAt), 'PPP')}` : 'Not renewing'}
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{biz.userCount}</div>
                <p className="text-xs text-muted-foreground">Team members in this account</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{businessTotalReviews}</div>
                <p className="text-xs text-muted-foreground">Reviews captured for this business</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{businessAverageRating.toFixed(1)} / 5</div>
                <p className="text-xs text-muted-foreground">Average internal rating</p>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Account Information</CardTitle>
                <CardDescription>Primary owner and account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Business ID</p>
                        <p className="font-mono bg-muted/50 px-2 py-1 rounded-md w-fit text-foreground break-all">{biz.id}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground">Owner Name</p>
                        <p>{biz.ownerName}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground">Owner Email</p>
                        <p className="break-all">{biz.ownerEmail}</p>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Account Created</p>
                        <p>{format(new Date(biz.createdAt), 'PPP')}</p>
                    </div>
                </div>
            </CardContent>
       </Card>

    </div>
  );
}
