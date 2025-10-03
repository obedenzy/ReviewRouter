
import { getSubscriptionStatus, getReviewsForBusiness, getBusiness, getCurrentUser } from '@/lib/actions';
import type { Business, Review } from '@/lib/types';
import { DashboardClientContent } from '@/components/dashboard/dashboard-client-content';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user || !user.businessId) {
      return <div>Business ID not found for this user.</div>;
  }

  const [subData, reviewsData, bizData] = await Promise.all([
      getSubscriptionStatus(user.businessId),
      getReviewsForBusiness(user.businessId),
      getBusiness(user.businessId)
  ]);
  
  const formattedSubData = {
      ...subData,
      renewsAt: subData.renewsAt ? format(subData.renewsAt, 'PPP') : null,
  };

  const totalReviews = reviewsData.length;
  const averageRating = totalReviews > 0 ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} Star`,
      count: reviewsData.filter(r => r.rating === rating).length
  }));

  const positiveReviews = reviewsData.filter(r => r.rating >= 4).length;
  const negativeReviews = reviewsData.filter(r => r.rating <= 2).length;

  const dashboardMetrics = {
      averageRating,
      totalReviews,
      ratingDistribution,
      positiveReviews,
      negativeReviews,
      positiveRedirects: bizData ? reviewsData.filter(r => r.rating >= bizData.redirect_threshold).length : 0,
  };


  return (
    <DashboardClientContent 
        subscriptionData={formattedSubData}
        business={bizData}
        reviews={reviewsData}
        dashboardMetrics={dashboardMetrics}
    />
  );
}
