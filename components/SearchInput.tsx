'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Post } from '@/types'

interface SearchInputProps {
  onResultClick?: () => void
}

export default function SearchInput({ onResultClick }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  // Search for posts
  useEffect(() => {
    const searchPosts = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.posts || [])
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return

    const maxIndex = Math.min(results.length - 1, 4) // Max 5 results shown (0-4)
    const hasViewAllOption = results.length > 5
    const totalOptions = Math.min(results.length, 5) + (hasViewAllOption ? 1 : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < totalOptions - 1 ? prev + 1 : prev
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev)
        break
      
      case 'Enter':
        e.preventDefault()
        if (selectedIndex === -1) {
          // No item selected, perform regular search
          if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
            setShowResults(false)
            setSelectedIndex(-1)
            inputRef.current?.blur()
          }
        } else if (selectedIndex < Math.min(results.length, 5)) {
          // Navigate to selected post
          const selectedPost = results[selectedIndex]
          if (selectedPost) {
            router.push(`/posts/${selectedPost.slug}`)
            handleResultClick()
          }
        } else {
          // View all results option selected
          router.push(`/search?q=${encodeURIComponent(query)}`)
          handleResultClick()
        }
        break
      
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSelectedIndex(-1)
    setQuery('')
    onResultClick?.()
  }

  const handleMouseEnter = (index: number) => {
    setSelectedIndex(index)
  }

  const handleViewAllMouseEnter = () => {
    setSelectedIndex(Math.min(results.length, 5))
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts..."
          className="w-full md:w-64 px-4 py-2 pl-10 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.slice(0, 5).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  onClick={handleResultClick}
                  onMouseEnter={() => handleMouseEnter(index)}
                  className={`block p-4 border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                    selectedIndex === index
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {post.metadata?.featured_image?.imgix_url && (
                      <img
                        src={`${post.metadata.featured_image.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                        alt={post.title}
                        className="w-12 h-9 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {post.metadata?.title || post.title}
                      </h4>
                      {post.metadata?.excerpt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {post.metadata.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {results.length > 5 && (
                <div className="p-3 border-t border-gray-100 dark:border-gray-600">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={handleResultClick}
                    onMouseEnter={handleViewAllMouseEnter}
                    className={`text-sm hover:underline ${
                      selectedIndex === Math.min(results.length, 5)
                        ? 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    View all {results.length} results
                  </Link>
                </div>
              )}
            </>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No posts found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}