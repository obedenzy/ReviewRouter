

'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Smile, Meh, Frown, Copy, Eye, Loader2, Download, Printer } from 'lucide-react';
import type { Review, Business } from '@/lib/types';
import { subDays, startOfDay, format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { StarRating } from '@/components/shared/star-rating';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { updateSettings, getBusiness } from '@/lib/actions';
import { QRCodeCanvas } from 'qrcode.react';

const chartConfig = {
  reviews: {
    label: 'Reviews',
    color: 'hsl(var(--primary))',
  },
  '1 Star': { label: '1 Star', color: 'hsl(var(--chart-5))' },
  '2 Star': { label: '2 Stars', color: 'hsl(var(--chart-4))' },
  '3 Star': { label: '3 Stars', color: 'hsl(var(--chart-3))' },
  '4 Star': { label: '4 Stars', color: 'hsl(var(--chart-2))' },
  '5 Star': { label: '5 Stars', color: 'hsl(var(--chart-1))' },
};

function SettingsSubmitButton({ text = 'Save Changes' }: { text?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

interface ReviewsClientPageProps {
    initialBusiness: Business | null;
    initialReviews: (Review & { createdAtFormatted: string })[];
}

export function ReviewsClientPage({ initialBusiness, initialReviews }: ReviewsClientPageProps) {
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 15;
  const [reviewUrl, setReviewUrl] = useState('');
  const { toast } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [business, setBusiness] = useState<Business | null>(initialBusiness);
  const [reviews, setReviews] = useState<(Review & { createdAtFormatted: string })[]>(initialReviews);

  const [promoText, setPromoText] = useState('Leave a review and get');
  const [promoOffer, setPromoOffer] = useState('10% OFF');
  const [promoCode, setPromoCode] = useState('REVIEW10');
  const promotionPreviewRef = useRef<HTMLDivElement>(null);

  const [state, formAction] = useActionState(updateSettings, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (business) {
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}/review?bid=${business.id}`;
            setReviewUrl(url);
        }
    }
  }, [business]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success && business?.id) {
        // refresh settings
        getBusiness(business.id).then(businessData => {
            if(businessData) {
                setBusiness(businessData);
            }
        });
      }
    }
  }, [state, toast, business?.id]);

  if(!business) {
      return <div>Loading reviews...</div>
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reviewUrl);
    toast({
      title: 'Copied!',
      description: 'Review link copied to clipboard.',
    });
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
        const canvas = qrCodeRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "review-qr-code.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
             toast({
                title: 'Downloaded!',
                description: 'QR Code has been downloaded.',
            });
        }
    }
  };

  const handlePrintPromotion = () => {
    if (promotionPreviewRef.current) {
        const qrCanvas = qrCodeRef.current?.querySelector('canvas');
        if (!qrCanvas) {
            toast({
                title: 'Error',
                description: 'Could not find QR Code to print.',
                variant: 'destructive',
            });
            return;
        }

        const qrDataUrl = qrCanvas.toDataURL('image/png');
        
        const printWindow = window.open('', '', 'height=800,width=600');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Promotion</title>');
            printWindow.document.write(`
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100%; margin: 0; background-color: #f9fafb; }
                    .preview-container { border: 2px dashed #9ca3af; padding: 2rem; width: 90%; max-width: 400px; text-align: center; background-color: white; }
                    h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; }
                    p { margin: 0.5rem 0; font-size: 1.125rem; color: #4b5563; }
                    .offer { font-size: 2.5rem; font-weight: 800; color: #f97316; margin: 1.5rem 0; }
                    .code { font-size: 1.5rem; font-weight: 700; background-color: #f3f4f6; padding: 0.5rem 1rem; border-radius: 0.375rem; display: inline-block; margin: 0.5rem 0; }
                    .scan-text { font-size: 0.875rem; color: #6b7281; margin-top: 1.5rem; }
                    .qr-code-wrapper { margin-top: 1rem; padding: 0.5rem; background-color: white; border-radius: 0.375rem; display: inline-block; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
                    @media print {
                        body { background-color: white; }
                        .preview-container { border: 2px dashed #9ca3af; box-shadow: none; }
                    }
                </style>
            `);
            printWindow.document.write('</head><body>');
            printWindow.document.write(`
                <div class="preview-container">
                    <h2>${business.name}</h2>
                    <p>${promoText}</p>
                    <div class="offer">${promoOffer}</div>
                    <p>with code:</p>
                    <div class="code">${promoCode}</div>
                    <p class="scan-text">Scan the QR code to leave a review!</p>
                    <div class="qr-code-wrapper">
                        <img src="${qrDataUrl}" alt="QR Code" style="width: 128px; height: 128px;" />
                    </div>
                </div>
            `);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }
  };


  const filteredReviews = reviews
    .filter(review => {
      const ratingMatch =
        ratingFilter === 'all' ||
        review.rating === parseInt(ratingFilter, 10);

      const now = new Date();
      const reviewDate = new Date(review.createdAt);
      if (isNaN(reviewDate.getTime())) return false;

      const dateMatch =
        dateFilter === 'all' ||
        (dateFilter === 'last_7_days' &&
          reviewDate >= subDays(now, 7)) ||
        (dateFilter === 'last_30_days' &&
          reviewDate >= subDays(now, 30)) ||
        (dateFilter === 'last_90_days' &&
          reviewDate >= subDays(now, 90));

      return ratingMatch && dateMatch;
    })
    .sort((a, b) => {
      if (dateFilter === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (dateFilter === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
  const totalReviews = filteredReviews.length;

  const positiveReviews = filteredReviews.filter(r => r.rating >= 4).length;
  const neutralReviews = filteredReviews.filter(r => r.rating === 3).length;
  const negativeReviews = filteredReviews.filter(r => r.rating <= 2).length;

   const chartData = [
    { rating: '5 Star', count: reviews.filter(r => r.rating === 5).length },
    { rating: '4 Star', count: reviews.filter(r => r.rating === 4).length },
    { rating: '3 Star', count: reviews.filter(r => r.rating === 3).length },
    { rating: '2 Star', count: reviews.filter(r => r.rating === 2).length },
    { rating: '1 Star', count: reviews.filter(r => r.rating === 1).length },
  ];


  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };


  const handleRowClick = (review: Review) => {
    setSelectedReview(review);
  };

  const handleCloseDialog = () => {
    setSelectedReview(null);
  };

  return (
    <Tabs defaultValue="reviews" className="space-y-4">
      <TabsList>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="promotions">Promotions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="reviews" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReviews}</div>
                <p className="text-xs text-muted-foreground">
                  Based on selected filters.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
                <Smile className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{positiveReviews}</div>
                <p className="text-xs text-muted-foreground">
                  4-5 star ratings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Neutral Reviews</CardTitle>
                <Meh className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{neutralReviews}</div>
                <p className="text-xs text-muted-foreground">
                  3 star ratings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Negative Reviews</CardTitle>
                <Frown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{negativeReviews}</div>
                <p className="text-xs text-muted-foreground">
                  1-2 star ratings.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Rating Distribution</CardTitle>
                        <CardDescription>
                        Breakdown of reviews captured internally.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip
                                content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                data={chartData}
                                dataKey="count"
                                nameKey="rating"
                                innerRadius={50}
                                strokeWidth={2}
                                >
                                {chartData.map((entry, index) => (
                                    <Cell
                                    key={`cell-${index}`}
                                    fill={chartConfig[entry.rating as keyof typeof chartConfig]?.color}
                                    />
                                ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle className="font-headline text-2xl">All Reviews</CardTitle>
                    <CardDescription>
                        A complete log of all feedback submitted through your form.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by rating" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                        </Select>
                        <Select value={dateFilter} onValueChange={(value) => { setDateFilter(value); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="last_7_days">Last 7 days</SelectItem>
                            <SelectItem value="last_30_days">Last 30 days</SelectItem>
                            <SelectItem value="last_90_days">Last 90 days</SelectItem>
                            <SelectItem value="newest">Sort by Newest</SelectItem>
                            <SelectItem value="oldest">Sort by Oldest</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead className="w-[40%]">Comment</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {paginatedReviews.map(review => {
                                const reviewDate = new Date(review.createdAt);
                                if (isNaN(reviewDate.getTime())) {
                                return null;
                                }
                                return (
                                <TableRow
                                    key={review.id}
                                    onClick={() => handleRowClick(review)}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-medium">
                                    {review.customerName}
                                    </TableCell>
                                     <TableCell className="text-muted-foreground">
                                        {review.email}
                                    </TableCell>
                                    <TableCell>
                                    <Badge
                                        variant={review.rating < 3 ? 'destructive' : review.rating > 3 ? 'secondary' : 'outline'}
                                        className="flex gap-1 w-fit"
                                    >
                                        {review.rating} <Star className="w-3 h-3" />
                                    </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground truncate max-w-xs">
                                    {review.comment}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                    {review.createdAtFormatted}
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </div>
                        <Pagination className="mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} aria-disabled={currentPage === 1}/>
                                </PaginationItem>
                                <PaginationItem>
                                    <span className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handleNextPage(); }} aria-disabled={currentPage === totalPages}/>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            </div>
          </div>
          <Dialog open={!!selectedReview} onOpenChange={handleCloseDialog}>
            <DialogContent>
              {selectedReview && (
                <>
                  <DialogHeader>
                    <DialogTitle>Review Details</DialogTitle>
                    <DialogDescription>
                      Full feedback from {selectedReview.customerName || 'Anonymous'}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-muted-foreground">
                        Rating:
                      </span>
                      <StarRating
                        value={selectedReview.rating}
                        onChange={() => {}}
                        size={20}
                      />
                    </div>
                     {selectedReview.email && (
                        <div>
                            <p className="font-medium text-muted-foreground mb-2">
                                Email:
                            </p>
                            <p className="p-2 bg-muted/50 rounded-md text-sm">
                                {selectedReview.email}
                            </p>
                        </div>
                    )}
                    <div>
                      <p className="font-medium text-muted-foreground mb-2">
                        Comment:
                      </p>
                      <p className="p-4 bg-muted/50 rounded-md">
                        {selectedReview.comment}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground pt-4">
                      Submitted on{' '}
                      {format(new Date(selectedReview.createdAt), 'PPPp')}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
      </TabsContent>
      <TabsContent value="promotions" className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Review Promotions</CardTitle>
                <CardDescription>
                    Create a printable flyer to encourage customers to leave reviews.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="promoText">Promo Text</Label>
                        <Input 
                            id="promoText" 
                            value={promoText} 
                            onChange={(e) => setPromoText(e.target.value)}
                        />
                    </div>
                     <div>
                        <Label htmlFor="promoOffer">Promo Offer</Label>
                        <Input 
                            id="promoOffer" 
                            value={promoOffer}
                            onChange={(e) => setPromoOffer(e.target.value)}
                        />
                    </div>
                     <div>
                        <Label htmlFor="promoCode">Promo Code</Label>
                        <Input 
                            id="promoCode" 
                            value={promoCode} 
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                    </div>
                    <Button onClick={handlePrintPromotion}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Promotion
                    </Button>
                </div>
                <div className="space-y-4">
                    <Label>Printable Preview</Label>
                    <div 
                        ref={promotionPreviewRef} 
                        className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center bg-background"
                    >
                        <h2 className="text-2xl font-bold font-headline mb-4">{business.name}</h2>
                        <p className="text-lg">{promoText}</p>
                        <h3 className="text-4xl font-extrabold text-primary my-4">{promoOffer}</h3>
                        <p className="text-lg">with code:</p>
                        <p className="text-2xl font-bold my-2 bg-muted px-4 py-2 rounded-md">{promoCode}</p>
                        <p className="text-sm text-muted-foreground mt-4">Scan the QR code to leave a review!</p>
                        <div ref={qrCodeRef} className="mt-4 p-2 bg-white rounded-md">
                            {reviewUrl ? (
                                <QRCodeCanvas value={reviewUrl} size={128} />
                            ) : (
                                <div className="w-[128px] h-[128px] bg-gray-200 animate-pulse rounded-md" />
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings" className="space-y-6">
        <form action={formAction}>
           <input type="hidden" name="businessId" value={business?.id || ''} />
           <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                Review Form & Routing
                </CardTitle>
                <CardDescription>
                Configure your unique review link and how it handles different ratings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="reviewUrl">Your Unique Review Link</Label>
                <div className="flex items-center gap-2">
                    <Input id="reviewUrl" value={reviewUrl} readOnly />
                    <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    aria-label="Copy review link"
                    >
                    <Copy className="h-4 w-4" />
                    </Button>
                    <Button asChild size="icon" variant="outline" aria-label="Preview review link">
                    <Link href={reviewUrl} target="_blank">
                        <Eye className="h-4 w-4" />
                    </Link>
                    </Button>
                </div>
                 <p className="text-sm text-muted-foreground pt-2">
                    Share this URL with customers to start collecting reviews.
                </p>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="redirectThreshold">
                    Google Redirect Threshold
                    </Label>
                    <Select
                    name="redirectThreshold"
                    defaultValue={String(business?.redirect_threshold || 4)}
                    >
                    <SelectTrigger
                        id="redirectThreshold"
                        className="w-full md:w-[280px]"
                    >
                        <SelectValue placeholder="Select a star rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars & Up</SelectItem>
                        <SelectItem value="3">3 Stars & Up</SelectItem>
                    </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground pt-1">
                        Reviews with this rating or higher will be prompted to post on
                        Google.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="googleReviewUrl">Google Review URL</Label>
                    <Input
                    id="googleReviewUrl"
                    name="googleReviewUrl"
                    placeholder="https://g.page/r/..."
                    defaultValue={business?.google_review_url || ""}
                    />
                    <p className="text-sm text-muted-foreground pt-1">
                        The direct link to your Google Business Profile review page.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <SettingsSubmitButton />
            </CardFooter>
            </Card>
        </form>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">
                    Review URL QR Code
                </CardTitle>
                <CardDescription>
                    Let customers easily access your review form by scanning a QR code.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg bg-muted/50">
                    <div ref={qrCodeRef} className="p-4 bg-white rounded-md shadow-md">
                        {reviewUrl ? (
                            <QRCodeCanvas value={reviewUrl} size={160} />
                        ) : (
                            <div className="w-[160px] h-[160px] bg-gray-200 animate-pulse rounded-md" />
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Scan this QR code to access your review form directly. Download it to use on business cards, menus, or posters.
                    </p>
                    <Button onClick={downloadQRCode} disabled={!reviewUrl}>
                        <Download className="mr-2 h-4 w-4" />
                        Download QR Code
                    </Button>
                </div>
            </CardContent>
        </Card>

      </TabsContent>
    </Tabs>
  );
}
