// app/posts/[slug]/page.tsx
import { getPost } from '@/lib/cosmic'
import { Post } from '@/types'
import { marked } from 'marked'
import { formatDate } from '@/lib/utils'
import CategoryBadge from '@/components/CategoryBadge'
import AuthorCard from '@/components/AuthorCard'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const postData = await getPost(slug)

  if (!postData) {
    notFound()
  }

  const post = postData as Post
  const content = post.metadata?.content || ''
  const htmlContent = marked(content)

  return (
    <article className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            {post.metadata?.categories && post.metadata.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.metadata.categories.map((category) => (
                  <CategoryBadge key={category.id} category={category} />
                ))}
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          {post.metadata?.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.metadata.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            {post.metadata?.author && (
              <AuthorCard author={post.metadata.author} showBio={false} />
            )}
            
            <time className="text-gray-500">
              {post.metadata?.publication_date 
                ? formatDate(post.metadata.publication_date)
                : formatDate(post.created_at)
              }
            </time>
          </div>
        </header>

        {/* Featured Image */}
        {post.metadata?.featured_image && (
          <div className="mb-8">
            <img
              src={`${post.metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              width={1200}
              height={600}
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Author Bio */}
        {post.metadata?.author && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Author</h3>
            <AuthorCard author={post.metadata.author} showBio={true} />
          </div>
        )}
      </div>
    </article>
  )
}