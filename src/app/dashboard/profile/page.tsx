
import { ProfileClientPage } from '@/components/dashboard/profile/page';
import { getCurrentUser } from '@/lib/actions';

export default async function ProfilePage() {
    const user = await getCurrentUser();
    return <ProfileClientPage user={user} />;
}
