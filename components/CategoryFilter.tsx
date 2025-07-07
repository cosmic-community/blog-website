'use client'

import Link from 'next/link'
import { Category } from '@/types'
import { usePathname } from 'next/navigation'

interface CategoryFilterProps {
  categories: Category[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          pathname === '/'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Posts
      </Link>
      
      {categories.map((category) => {
        const isActive = pathname === `/categories/${category.slug}`
        
        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={isActive ? { backgroundColor: category.metadata?.color || '#6B7280' } : {}}
          >
            {category.metadata?.name || category.title}
          </Link>
        )
      })}
    </div>
  )
}