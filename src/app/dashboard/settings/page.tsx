
import { getBusiness, getCurrentUser } from '@/lib/actions';
import { SettingsClientPage } from '@/components/dashboard/settings/page';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function SettingsPage() {
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
    
    const business = await getBusiness(user.businessId);

    return (
        <SettingsClientPage business={business} user={user} />
    )
}
