'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const links = [
  { href: '/dashboard/cv', label: 'CV + Cover Letter' },
  { href: '/dashboard/instagram', label: 'Instagram Planner' },
  { href: '/dashboard/business-ideas', label: 'Business Ideas' },
  { href: '/dashboard/profile', label: 'My Profile' },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null; // 🚫 Hide sidebar if not logged in

  return (
    <aside className="w-60 bg-white border-r h-screen p-4">
      <h2 className="text-lg font-bold mb-2 text-green-700">Dashboard</h2>
      
      {session?.user?.isPro && (
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
            Pro User 🌟
          </span>
        </div>
      )}

      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded hover:bg-green-100 ${
              pathname === link.href ? 'bg-green-200 font-semibold text-green-800' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
