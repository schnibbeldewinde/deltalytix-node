import { Suspense } from 'react'
import { BusinessManagement } from '../components/business-management'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    // If no businesses found, show the default dashboard with a message
    return (
        <div className="px-2 sm:px-6 lg:px-32">
            <BusinessManagement />
            {children}
        </div>
    )
} 
