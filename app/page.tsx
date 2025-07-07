import { getPosts, getCategories } from '@/lib/cosmic'
import { Post, Category } from '@/types'
import PostCard from '@/components/PostCard'
import CategoryFilter from '@/components/CategoryFilter'
import FeaturedPost from '@/components/FeaturedPost'

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories()
  ])

  const typedPosts = posts as Post[]
  const typedCategories = categories as Category[]

  const featuredPost = typedPosts.find(post => post.metadata?.featured)
  const regularPosts = typedPosts.filter(post => !post.metadata?.featured)

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights on technology, lifestyle, and travel from our expert writers
        </p>
      </div>

      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Post</h2>
          <FeaturedPost post={featuredPost} />
        </div>
      )}

      <div className="mb-8">
        <CategoryFilter categories={typedCategories} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {regularPosts.length === 0 && !featuredPost && (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts available at the moment.</p>
        </div>
      )}
    </div>
  )
}