import Link from 'next/link'
import { Post } from '@/types'
import { formatDate, getExcerpt } from '@/lib/utils'
import CategoryBadge from '@/components/CategoryBadge'
import AuthorCard from '@/components/AuthorCard'

interface FeaturedPostProps {
  post: Post
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const excerpt = post.metadata?.excerpt || 
    (post.metadata?.content ? getExcerpt(post.metadata.content, 200) : '')

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {post.metadata?.featured_image && (
          <div className="relative">
            <Link href={`/posts/${post.slug}`}>
              <img
                src={`${post.metadata.featured_image.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                alt={post.title}
                className="w-full h-64 lg:h-full object-cover hover:opacity-95 transition-opacity"
                width={400}
                height={300}
              />
            </Link>
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {post.metadata?.categories && post.metadata.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.metadata.categories.slice(0, 2).map((category) => (
                <CategoryBadge key={category.id} category={category} />
              ))}
            </div>
          )}
          
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            <Link 
              href={`/posts/${post.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          
          {excerpt && (
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            {post.metadata?.author && (
              <AuthorCard author={post.metadata.author} showBio={false} />
            )}
            
            <time className="text-gray-500 dark:text-gray-400">
              {post.metadata?.publication_date 
                ? formatDate(post.metadata.publication_date)
                : formatDate(post.created_at)
              }
            </time>
          </div>
          
          <div className="mt-6">
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Read more
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}