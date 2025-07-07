// app/authors/[slug]/page.tsx
import { getAuthor, getPostsByAuthor } from '@/lib/cosmic'
import { Author, Post } from '@/types'
import PostCard from '@/components/PostCard'
import AuthorCard from '@/components/AuthorCard'
import { notFound } from 'next/navigation'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const [authorData, postsData] = await Promise.all([
    getAuthor(slug),
    getAuthor(slug).then(author => author ? getPostsByAuthor(author.id) : [])
  ])

  if (!authorData) {
    notFound()
  }

  const author = authorData as Author
  const posts = postsData as Post[]

  return (
    <div className="container py-8">
      <div className="mb-12">
        <AuthorCard author={author} showBio={true} showSocial={true} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Posts by {author.metadata?.name || author.title}
        </h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts found by this author.</p>
        </div>
      )}
    </div>
  )
}