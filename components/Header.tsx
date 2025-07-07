import Link from 'next/link'
import { getCategories } from '@/lib/cosmic'
import { Category } from '@/types'

export default async function Header() {
  const categoriesData = await getCategories()
  const categories = categoriesData as Category[]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Blog Website
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {category.metadata?.name || category.title}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button - simplified */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}