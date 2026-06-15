import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  const linkCount = await prisma.link.count()

  return (
    <div className="flex min-h-screen" style={{ background: '#F0F5F2' }}>
      <AdminSidebar
        nome={user?.nome ?? 'Admin'}
        email={user?.email ?? ''}
        linkCount={linkCount}
      />
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
