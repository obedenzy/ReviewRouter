

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getReviewsForBusiness, getBusiness, getCurrentUser } from '@/lib/actions';
import { ReviewsClientPage } from '@/components/dashboard/reviews/page';
import { format } from 'date-fns';
import type { Review } from '@/lib/types';

export default async function ReviewsPage() {
    const user = await getCurrentUser();
    
    if (!user || !user.businessId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Could not load user or business information.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const [businessData, reviewsData] = await Promise.all([
        getBusiness(user.businessId),
        getReviewsForBusiness(user.businessId)
    ]);
    
    const formattedReviews: (Review & { createdAtFormatted: string })[] = reviewsData.map(review => ({
        ...review,
        createdAt: review.createdAt,
        createdAtFormatted: format(new Date(review.createdAt), 'PPP')
    }));

    return (
        <ReviewsClientPage initialBusiness={businessData} initialReviews={formattedReviews} />
    )
}


    