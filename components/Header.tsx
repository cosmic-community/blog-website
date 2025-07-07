import Link from 'next/link'
import { getCategories } from '@/lib/cosmic'
import { Category } from '@/types'
import SearchInput from './SearchInput'
import ClientHeader from './ClientHeader'

export default async function Header() {
  let categories: Category[] = []
  
  try {
    categories = await getCategories() as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Continue with empty categories array
  }

  return <ClientHeader categories={categories} />
}