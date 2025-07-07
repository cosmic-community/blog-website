import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { getCategories, getAuthors } from '@/lib/cosmic'
import { Category, Author } from '@/types'
import DashboardNav from '@/components/DashboardNav'
import PostEditor from '@/components/PostEditor'

export const metadata = {
  title: 'Create Post - Dashboard',
  description: 'Create a new blog post',
}

export default async function CreatePostPage() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }

  let categories: Category[] = []
  let authors: Author[] = []
  
  try {
    [categories, authors] = await Promise.all([
      getCategories() as Promise<Category[]>,
      getAuthors() as Promise<Author[]>
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Fill out the form below to create a new blog post.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <PostEditor categories={categories} authors={authors} />
          </div>
        </div>
      </div>
    </div>
  )
}