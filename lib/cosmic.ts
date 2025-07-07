import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || '',
  readKey: process.env.COSMIC_READ_KEY || ''
})

export async function getAllPosts() {
  try {
    const data = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return data.objects || []
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching posts:', error)
    throw error
  }
}

export async function getPost(slug: string) {
  try {
    const data = await cosmic.objects
      .findOne({ type: 'posts', slug })
      .depth(1)

    return data.object
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getCategories() {
  try {
    const data = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return data.objects || []
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function getAuthors() {
  try {
    const data = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return data.objects || []
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching authors:', error)
    throw error
  }
}

export async function getAuthor(slug: string) {
  try {
    const data = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .depth(1)

    return data.object
  } catch (error) {
    console.error('Error fetching author:', error)
    return null
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    // First get the category to find its ID
    const categories = await getCategories()
    const category = categories.find((cat) => cat.slug === categorySlug)
    
    if (!category) {
      return []
    }

    // Then get posts that have this category
    const data = await cosmic.objects
      .find({ 
        type: 'posts',
        'metadata.categories': category.id
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return data.objects || []
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching posts by category:', error)
    throw error
  }
}

export async function getPostsByAuthor(authorSlug: string) {
  try {
    // First get the author to find its ID
    const authors = await getAuthors()
    const author = authors.find((auth) => auth.slug === authorSlug)
    
    if (!author) {
      return []
    }

    // Then get posts that have this author
    const data = await cosmic.objects
      .find({ 
        type: 'posts',
        'metadata.author': author.id
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return data.objects || []
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching posts by author:', error)
    throw error
  }
}

export async function getFeaturedPosts() {
  try {
    const data = await cosmic.objects
      .find({ 
        type: 'posts',
        'metadata.featured': true
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')
      .limit(3)

    return data.objects || []
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching featured posts:', error)
    throw error
  }
}

export async function searchPosts(query: string) {
  try {
    const data = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    const posts = data.objects || []
    
    // Filter posts based on search query
    const filteredPosts = posts.filter((post) => {
      const title = post.title?.toLowerCase() || ''
      const excerpt = post.metadata?.excerpt?.toLowerCase() || ''
      const content = post.metadata?.content?.toLowerCase() || ''
      const searchTerm = query.toLowerCase()
      
      return title.includes(searchTerm) || 
             excerpt.includes(searchTerm) || 
             content.includes(searchTerm)
    })

    return filteredPosts
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error searching posts:', error)
    throw error
  }
}