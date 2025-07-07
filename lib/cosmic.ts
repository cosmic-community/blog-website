import { createBucketClient } from '@cosmicjs/sdk'

// Check if required environment variables are available
const bucketSlug = process.env.COSMIC_BUCKET_SLUG
const readKey = process.env.COSMIC_READ_KEY

// Only create client if credentials are available
const cosmic = bucketSlug && readKey 
  ? createBucketClient({
      bucketSlug,
      readKey
    })
  : null

// Export the cosmic client for use in other files
export { cosmic }

// Helper function to check if Cosmic is configured
export function isCosmicConfigured(): boolean {
  return !!(bucketSlug && readKey && cosmic)
}

export async function getAllPosts() {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty posts array')
    return []
  }

  try {
    const data = await cosmic!.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return data.objects || []
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error fetching posts:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}

// Add getPosts function that app/page.tsx is trying to import
export async function getPosts() {
  return getAllPosts()
}

export async function getPost(slug: string) {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning null for post')
    return null
  }

  try {
    const data = await cosmic!.objects
      .findOne({ type: 'posts', slug })
      .depth(1)

    return data.object
  } catch (error: unknown) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getCategories() {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty categories array')
    return []
  }

  try {
    const data = await cosmic!.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return data.objects || []
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error fetching categories:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}

export async function getAuthors() {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty authors array')
    return []
  }

  try {
    const data = await cosmic!.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return data.objects || []
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error fetching authors:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}

export async function getAuthor(slug: string) {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning null for author')
    return null
  }

  try {
    const data = await cosmic!.objects
      .findOne({ type: 'authors', slug })
      .depth(1)

    return data.object
  } catch (error: unknown) {
    console.error('Error fetching author:', error)
    return null
  }
}

export async function getPostsByCategory(categorySlug: string) {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty posts array')
    return []
  }

  try {
    // First get the category to find its ID
    const categories = await getCategories()
    const category = categories.find((cat: any) => cat.slug === categorySlug)
    
    if (!category) {
      return []
    }

    // Then get posts that have this category
    const data = await cosmic!.objects
      .find({ 
        type: 'posts',
        'metadata.categories': category.id
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return data.objects || []
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error fetching posts by category:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}

export async function getPostsByAuthor(authorSlug: string) {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty posts array')
    return []
  }

  try {
    // First get the author to find its ID
    const authors = await getAuthors()
    const author = authors.find((auth: any) => auth.slug === authorSlug)
    
    if (!author) {
      return []
    }

    // Then get posts that have this author
    const data = await cosmic!.objects
      .find({ 
        type: 'posts',
        'metadata.author': author.id
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return data.objects || []
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error fetching posts by author:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}

export async function getFeaturedPosts() {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty featured posts array')
    return []
  }

  try {
    const data = await cosmic!.objects
      .find({ 
        type: 'posts',
        'metadata.featured': true
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')
      .limit(3)

    return data.objects || []
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error fetching featured posts:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}

export async function searchPosts(query: string) {
  if (!isCosmicConfigured()) {
    console.warn('Cosmic CMS not configured - returning empty search results')
    return []
  }

  try {
    const data = await cosmic!.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    const posts = data.objects || []
    
    // Filter posts based on search query
    const filteredPosts = posts.filter((post: any) => {
      const title = post.title?.toLowerCase() || ''
      const excerpt = post.metadata?.excerpt?.toLowerCase() || ''
      const content = post.metadata?.content?.toLowerCase() || ''
      const searchTerm = query.toLowerCase()
      
      return title.includes(searchTerm) || 
             excerpt.includes(searchTerm) || 
             content.includes(searchTerm)
    })

    return filteredPosts
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      return []
    }
    console.error('Error searching posts:', error)
    return [] // Return empty array instead of throwing to prevent build failure
  }
}