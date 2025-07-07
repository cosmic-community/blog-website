import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { getPosts } from '@/lib/cosmic'
import { Post } from '@/types'
import DashboardNav from '@/components/DashboardNav'

export const metadata = {
  title: 'Dashboard - Blog Website',
  description: 'Admin dashboard for managing blog posts',
}

export default async function DashboardPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }

  let posts: Post[] = []
  
  try {
    posts = await getPosts() as Post[]
  } catch (error) {
    console.error('Error fetching posts:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
            <Link
              href="/dashboard/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create New Post
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.length === 0 ? (
                <li className="px-4 py-4 text-gray-500 dark:text-gray-400 text-center">
                  No posts found. <Link href="/dashboard/create" className="text-blue-600 hover:text-blue-700">Create your first post</Link>
                </li>
              ) : (
                posts.map((post) => (
                  <li key={post.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                            {post.metadata?.title || post.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              {post.status || 'Published'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {post.metadata?.excerpt}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                            <p>
                              Created: {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}