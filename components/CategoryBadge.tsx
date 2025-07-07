import Link from 'next/link'
import { Category } from '@/types'

interface CategoryBadgeProps {
  category: Category
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs' 
    : 'px-3 py-1 text-sm'

  const bgColor = category.metadata?.color || '#6B7280'

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`inline-block ${sizeClasses} rounded-full font-medium text-white hover:opacity-90 transition-opacity`}
      style={{ backgroundColor: bgColor }}
    >
      {category.metadata?.name || category.title}
    </Link>
  )
}