import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ posts: [] })
  }

  try {
    // Fetch all posts and filter on the server side
    // Cosmic doesn't have full-text search, so we'll do it client-side
    const response = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    const allPosts = response.objects || []
    
    // Filter posts based on query
    const searchQuery = query.toLowerCase().trim()
    const filteredPosts = allPosts.filter(post => {
      const title = (post.metadata?.title || post.title || '').toLowerCase()
      const excerpt = (post.metadata?.excerpt || '').toLowerCase()
      const content = (post.metadata?.content || '').toLowerCase()
      
      return title.includes(searchQuery) || 
             excerpt.includes(searchQuery) || 
             content.includes(searchQuery)
    })

    // Sort by relevance (title matches first, then excerpt, then content)
    const sortedPosts = filteredPosts.sort((a, b) => {
      const aTitle = (a.metadata?.title || a.title || '').toLowerCase()
      const bTitle = (b.metadata?.title || b.title || '').toLowerCase()
      const aExcerpt = (a.metadata?.excerpt || '').toLowerCase()
      const bExcerpt = (b.metadata?.excerpt || '').toLowerCase()

      const aTitleMatch = aTitle.includes(searchQuery)
      const bTitleMatch = bTitle.includes(searchQuery)
      const aExcerptMatch = aExcerpt.includes(searchQuery)
      const bExcerptMatch = bExcerpt.includes(searchQuery)

      if (aTitleMatch && !bTitleMatch) return -1
      if (!aTitleMatch && bTitleMatch) return 1
      if (aExcerptMatch && !bExcerptMatch) return -1
      if (!aExcerptMatch && bExcerptMatch) return 1
      
      return 0
    })

    return NextResponse.json({ 
      posts: sortedPosts,
      total: sortedPosts.length 
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ 
      posts: [],
      total: 0,
      error: 'Failed to search posts' 
    }, { status: 500 })
  }
}