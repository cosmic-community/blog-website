// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCategories, getPostsByCategory } from '@/lib/cosmic'
import { Category, Post } from '@/types'
import PostCard from '@/components/PostCard'
import CategoryBadge from '@/components/CategoryBadge'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    return categories.map((category: Category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  
  try {
    const categories = await getCategories()
    const category = categories.find((cat: Category) => cat.slug === slug)
    
    if (!category) {
      return {
        title: 'Category Not Found',
      }
    }

    return {
      title: `${category.metadata?.name || category.title} - Blog Website`,
      description: category.metadata?.description || `Posts in ${category.metadata?.name || category.title} category`,
    }
  } catch (error) {
    return {
      title: 'Category - Blog Website',
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  try {
    const [categories, posts] = await Promise.all([
      getCategories(),
      getPostsByCategory(slug)
    ])

    const category = categories.find((cat: Category) => cat.slug === slug)

    if (!category) {
      notFound()
    }

    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <CategoryBadge category={category} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {category.metadata?.name || category.title}
            </h1>
          </div>
          
          {category.metadata?.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {category.metadata.description}
            </p>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No posts found in this category yet.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}