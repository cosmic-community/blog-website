import ThemeSwitch from './ThemeSwitch'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Blog Website</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              A modern blog platform sharing insights on technology, lifestyle, and travel.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/categories/technology" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="/categories/lifestyle" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Lifestyle
                </a>
              </li>
              <li>
                <a href="/categories/travel" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Travel
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 dark:text-gray-500">
              © 2024 Blog Website. Built with Next.js and Cosmic.
            </p>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  )
}