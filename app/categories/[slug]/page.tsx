// app/categories/[slug]/page.tsx
import { getCategory, getPostsByCategory } from '@/lib/cosmic'
import { Category, Post } from '@/types'
import PostCard from '@/components/PostCard'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [categoryData, postsData] = await Promise.all([
    getCategory(slug),
    getCategory(slug).then(cat => cat ? getPostsByCategory(cat.id) : [])
  ])

  if (!categoryData) {
    notFound()
  }

  const category = categoryData as Category
  const posts = postsData as Post[]

  return (
    <div className="container py-8">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          {category.metadata?.color && (
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.metadata.color }}
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {category.metadata?.name || category.title}
          </h1>
        </div>
        
        {category.metadata?.description && (
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            {category.metadata.description}
          </p>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No posts found in this category.</p>
        </div>
      )}
    </div>
  )
}