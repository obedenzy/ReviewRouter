
import { getCurrentUser, getTeamUsers } from '@/lib/actions';
import { UsersClientPage } from '@/components/dashboard/users/page';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';

export default async function UsersPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.businessId) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Could not load user or business information.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const teamUsers = await getTeamUsers(currentUser.businessId);

    const formattedUsers = teamUsers.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(), // Pass as string
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null, // Pass as string
        createdAtFormatted: format(user.createdAt, 'PPP'),
        lastLoginFormatted: user.status === 'active' && user.lastLogin 
            ? `${formatDistanceToNow(user.lastLogin)} ago` 
            : 'Pending invite'
    }));

    return (
        <UsersClientPage 
            initialUsers={formattedUsers}
            currentUser={currentUser}
            businessId={currentUser.businessId}
        />
    )
}
