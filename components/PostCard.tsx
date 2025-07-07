import Link from 'next/link'
import { Post } from '@/types'
import { formatDate, getExcerpt } from '@/lib/utils'
import CategoryBadge from '@/components/CategoryBadge'
import AuthorCard from '@/components/AuthorCard'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const excerpt = post.metadata?.excerpt || 
    (post.metadata?.content ? getExcerpt(post.metadata.content) : '')

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {post.metadata?.featured_image && (
        <Link href={`/posts/${post.slug}`}>
          <img
            src={`${post.metadata.featured_image.imgix_url}?w=600&h=300&fit=crop&auto=format,compress`}
            alt={post.title}
            className="w-full h-48 object-cover hover:opacity-95 transition-opacity"
            width={300}
            height={200}
          />
        </Link>
      )}
      
      <div className="p-6">
        {post.metadata?.categories && post.metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.metadata.categories.slice(0, 2).map((category) => (
              <CategoryBadge key={category.id} category={category} size="sm" />
            ))}
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          <Link 
            href={`/posts/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        
        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {post.metadata?.author && (
            <AuthorCard author={post.metadata.author} showBio={false} size="sm" />
          )}
          
          <time className="text-sm text-gray-500">
            {post.metadata?.publication_date 
              ? formatDate(post.metadata.publication_date)
              : formatDate(post.created_at)
            }
          </time>
        </div>
      </div>
    </article>
  )
}