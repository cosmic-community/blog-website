import { Suspense } from 'react'
import { searchPosts } from '@/lib/cosmic'
import { Post } from '@/types'
import SearchResults from '@/components/SearchResults'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

function SearchLoading() {
  return (
    <div className="container py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function SearchPageContent({ query }: { query: string }) {
  const posts = await searchPosts(query)

  return (
    <div className="container py-12">
      <SearchResults posts={posts as Post[]} query={query} total={posts.length} />
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''

  if (!query.trim()) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search term to find posts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchPageContent query={query} />
    </Suspense>
  )
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  
  return {
    title: query ? `Search results for "${query}"` : 'Search Posts',
    description: query ? `Search results for "${query}"` : 'Search for blog posts',
  }
}