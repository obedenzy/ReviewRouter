
'use client';

import { useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users, CreditCard, Smile, Frown, CheckCircle, AlertCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import type { Review, Business } from "@/lib/types";

interface FormattedSubscriptionStatus {
    status: 'active' | 'inactive' | 'pending_cancellation';
    planName: string;
    amount: number;
    renewsAt: string | null;
}

interface DashboardClientContentProps {
    subscriptionData: FormattedSubscriptionStatus | null;
    business?: Business | null;
    reviews: Review[];
    dashboardMetrics: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { rating: string, count: number }[];
        positiveReviews: number;
        negativeReviews: number;
        positiveRedirects: number;
    }
}

export function DashboardClientContent({ subscriptionData, business, reviews, dashboardMetrics }: DashboardClientContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const chartConfig = {
    count: {
      label: "Count",
    },
    '1 Star': { label: '1 Star', color: 'hsl(var(--chart-5))' },
    '2 Star': { label: '2 Stars', color: 'hsl(var(--chart-4))' },
    '3 Star': { label: '3 Stars', color: 'hsl(var(--chart-3))' },
    '4 Star': { label: '4 Stars', color: 'hsl(var(--chart-2))' },
    '5 Star': { label: '5 Stars', color: 'hsl(var(--chart-1))' },
  };
  
  const chartData = dashboardMetrics.ratingDistribution.map(item => ({
    name: item.rating,
    value: item.count,
    fill: chartConfig[item.rating as keyof typeof chartConfig]?.color
  }));

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );


  return (
    <div className="grid gap-4 md:gap-8">
       {subscriptionData && business?.status !== 'active' ? (
          <Alert variant={subscriptionData.status === 'inactive' || subscriptionData.status === 'pending_cancellation' ? 'destructive' : 'default'}>
            {subscriptionData.status === 'inactive' || subscriptionData.status === 'pending_cancellation' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>
              {subscriptionData.status === 'inactive'
                ? 'Your Subscription is Inactive'
                : subscriptionData.status === 'pending_cancellation'
                ? 'Subscription Pending Cancellation'
                : 'Subscription Active'}
            </AlertTitle>
            <AlertDescription>
                {subscriptionData.status === 'inactive' 
                    ? 'Your business account is currently inactive. Please activate your subscription to restore full functionality.'
                    : subscriptionData.status === 'pending_cancellation'
                    ? `Your plan is set to cancel on ${subscriptionData.renewsAt || 'the end of the period'}. You can reactivate it in the billing section.`
                    : `Your account is active. Your plan renews on ${subscriptionData.renewsAt || 'N/A'}.`
                }
                 <Button asChild variant="link" className="p-0 h-auto ml-2">
                    <Link href="/dashboard/billing">
                        {subscriptionData.status === 'active' ? 'Manage Billing' : 'Go to Billing'}
                    </Link>
                </Button>
            </AlertDescription>
          </Alert>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.averageRating.toFixed(1)} / 5
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {dashboardMetrics.totalReviews} internal reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reviews
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.totalReviews}
            </div>
            <p className="text-xs text-muted-foreground">
              Feedback captured via your link
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Positive Reviews
            </CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardMetrics.positiveReviews}</div>
            <p className="text-xs text-muted-foreground">
              4-star and 5-star ratings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Negative Reviews
            </CardTitle>
            <Frown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.negativeReviews}</div>
            <p className="text-xs text-muted-foreground">
              1-star and 2-star ratings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Google Redirects
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardMetrics.positiveRedirects}</div>
            <p className="text-xs text-muted-foreground">
              Customers sent to Google
            </p>
          </CardContent>
        </Card>
        {business && subscriptionData && (
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="text-xl font-bold">
                {subscriptionData.status === 'active' ? subscriptionData.planName : 'No Active Plan'}
              </div>
              <p className="text-xs text-muted-foreground">
                {subscriptionData.status === 'active' && subscriptionData.renewsAt 
                  ? `Renews on ${subscriptionData.renewsAt}` 
                  : 'Subscription is inactive.'}
              </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" variant={subscriptionData.status === 'active' ? 'outline' : 'default'}>
                    <Link href="/dashboard/billing">
                        {subscriptionData.status === 'active' ? 'Manage Subscription' : 'Activate Plan'}
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of reviews captured internally.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      labelLine={false}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="hsl(var(--foreground))"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                          >
                            {chartData[index].name} ({value})
                          </text>
                        );
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Recent Reviews</CardTitle>
            <CardDescription>
              The latest feedback from your customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="font-medium">{review.customerName}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {review.comment}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={review.rating < 3 ? "destructive" : "secondary"}>
                          {review.rating} ★
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} aria-disabled={currentPage === 1} />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handleNextPage(); }} aria-disabled={currentPage === totalPages} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

  

    