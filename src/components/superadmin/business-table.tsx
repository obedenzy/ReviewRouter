
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit } from 'lucide-react';
import type { Business } from '@/lib/types';
import { format } from 'date-fns';
import { EditBusinessDialog } from './edit-business-dialog';
import { updateBusiness } from '@/lib/actions';

interface BusinessTableProps {
  businesses: Business[];
  onUpdateBusiness: (business: Business) => void;
}

export function BusinessTable({ businesses, onUpdateBusiness }: BusinessTableProps) {
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
  const handleStatusToggle = (business: Business) => {
    const updatedBusiness = {
        ...business,
        status: business.status === 'active' ? 'inactive' : 'active'
    };
    onUpdateBusiness(updatedBusiness);
    updateBusiness(business.id, { status: updatedBusiness.status });
  }

  const getStatusBadge = (status: Business['status']) => {
    switch (status) {
        case 'active':
            return <Badge variant="secondary">Active</Badge>;
        case 'inactive':
            return <Badge variant="destructive">Inactive</Badge>;
        case 'pending_cancellation':
            return <Badge variant="destructive">Pending Cancellation</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.map(business => (
              <TableRow key={business.id}>
                <TableCell className="font-medium">
                  <Link href={`/superadmin/dashboard/businesses/${business.id}`} className="hover:underline">
                    {business.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{business.ownerName}</div>
                  <div className="text-sm text-muted-foreground break-all">
                    {business.ownerEmail}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(business.status)}
                </TableCell>
                 <TableCell>${business.subscriptionAmount.toFixed(2)}/mo</TableCell>
                 <TableCell>{business.userCount || 0}</TableCell>
                <TableCell>{format(new Date(business.createdAt), 'PPP')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setEditingBusiness(business)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleStatusToggle(business)}>
                        {business.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditBusinessDialog 
        isOpen={!!editingBusiness}
        onOpenChange={(open) => !open && setEditingBusiness(null)}
        business={editingBusiness}
        onUpdateBusiness={(updated) => {
            onUpdateBusiness(updated);
            setEditingBusiness(null);
        }}
      />
    </>
  );
}
