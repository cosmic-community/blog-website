# Blog Website

A modern, responsive blog website built with Next.js and powered by Cosmic CMS. Features blog posts, author profiles, and category organization with a clean, professional design.

![Blog Website](https://imgix.cosmicjs.com/b9fe2760-5b5e-11f0-a051-23c10f41277a-photo-1555066931-4365d14bab8c-1751912285208.jpg?w=1200&h=600&fit=crop&auto=format,compress)

## Features

- 📝 Dynamic blog posts with markdown content
- 👤 Author profiles with social links
- 🏷️ Category-based post organization
- 🎨 Color-coded categories
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and App Router
- 🎯 SEO optimized
- 🌟 Featured posts highlighting
- 🔍 Clean typography with Inter font

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=blog-website-production)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a content model for a blog with posts, authors, and categories"

### Code Generation Prompt

> Build a Next.js website that uses my existing objects in this bucket. Set apiEnvironment: "staging" to the cosmic config

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Content Management**: Cosmic CMS
- **Language**: TypeScript
- **Font**: Inter
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Cosmic credentials:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Posts
```typescript
import { cosmic } from '@/lib/cosmic'

const posts = await cosmic.objects
  .find({ type: 'posts' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching a Single Post
```typescript
const post = await cosmic.objects
  .findOne({ type: 'posts', slug: 'post-slug' })
  .depth(1)
```

### Fetching Authors
```typescript
const authors = await cosmic.objects
  .find({ type: 'authors' })
  .props(['id', 'title', 'slug', 'metadata'])
```

## Cosmic CMS Integration

This application integrates with Cosmic using the following object types:

- **Posts**: Blog posts with title, content, featured images, and relationships to authors and categories
- **Authors**: Author profiles with bio, profile photos, and social links
- **Categories**: Post categories with descriptions and color coding

The app uses Cosmic's depth parameter to fetch related objects efficiently and imgix_url for optimized image delivery.

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Build the project: `bun run build`
2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

Make sure to set your environment variables in your hosting platform's dashboard.
<!-- README_END -->