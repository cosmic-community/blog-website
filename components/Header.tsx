import Link from 'next/link'
import { getCategories } from '@/lib/cosmic'
import { Category } from '@/types'
import SearchInput from './SearchInput'

export default async function Header() {
  const categoriesData = await getCategories()
  const categories = categoriesData as Category[]

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-colors">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Blog Website
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {category.metadata?.name || category.title}
              </Link>
            ))}
          </nav>

          {/* Search Input */}
          <div className="flex items-center space-x-4">
            <SearchInput />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}