import Link from 'next/link'
import { Author } from '@/types'

interface AuthorCardProps {
  author: Author
  showBio?: boolean
  showSocial?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function AuthorCard({ 
  author, 
  showBio = false, 
  showSocial = false,
  size = 'md' 
}: AuthorCardProps) {
  const avatarSize = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }[size]

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[size]

  return (
    <div className="flex items-start gap-3">
      {author.metadata?.profile_photo && (
        <Link href={`/authors/${author.slug}`}>
          <img
            src={`${author.metadata.profile_photo.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
            alt={author.metadata?.name || author.title}
            className={`${avatarSize} rounded-full object-cover hover:opacity-90 transition-opacity`}
            width={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
            height={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
          />
        </Link>
      )}
      
      <div className="flex-1 min-w-0">
        <Link
          href={`/authors/${author.slug}`}
          className={`${textSize} font-medium text-gray-900 hover:text-blue-600 transition-colors`}
        >
          {author.metadata?.name || author.title}
        </Link>
        
        {showBio && author.metadata?.bio && (
          <p className="text-gray-600 mt-1 leading-relaxed">
            {author.metadata.bio}
          </p>
        )}
        
        {showSocial && (
          <div className="flex items-center gap-4 mt-3">
            {author.metadata?.website && (
              <a
                href={author.metadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Website
              </a>
            )}
            
            {author.metadata?.twitter && (
              <a
                href={`https://twitter.com/${author.metadata.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                Twitter
              </a>
            )}
            
            {author.metadata?.linkedin && (
              <a
                href={author.metadata.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}