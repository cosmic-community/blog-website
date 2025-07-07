import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ posts: [] })
  }

  try {
    const posts = await searchPosts(query)

    return NextResponse.json({ 
      posts: posts,
      total: posts.length 
    })
  } catch (error: unknown) {
    console.error('Search API error:', error)
    return NextResponse.json({ 
      posts: [],
      total: 0,
      error: 'Failed to search posts' 
    }, { status: 500 })
  }
}