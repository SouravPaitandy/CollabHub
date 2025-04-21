// components/common/Button.js
import Link from 'next/link'

export function Button({ href, className, children }) {
  return (
    <Link href={href} className={`px-6 py-3 rounded-md text-lg font-semibold ${className}`}>
      {children}
    </Link>
  )
}