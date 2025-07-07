import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'
import { isAuthenticated } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Initialize Cosmic client with write permissions
    const cosmic = createBucketClient({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      writeKey: process.env.COSMIC_WRITE_KEY!
    })

    // Prepare post data
    const postData = {
      title: data.title,
      type: 'posts',
      status: 'published',
      metadata: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author || null,
        categories: data.categories || [],
        publication_date: data.publication_date,
        featured: data.featured || false
      }
    }

    // Create the post in Cosmic
    const response = await cosmic.objects.insertOne(postData)
    
    return NextResponse.json({ success: true, post: response.object })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}