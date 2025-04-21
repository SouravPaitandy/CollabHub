'use client'

import { useSession } from "next-auth/react"
import Loading from '@/components/Loading'
import { useState, useEffect } from 'react'

export default function SessionProvider({ children }) {
   const { status } = useSession()
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   if (status !== "loading") {
  //     // If the status is not loading, we'll still show the loading state for 1 seconds
  //     const timer = setTimeout(() => {
  //       setIsLoading(false)
  //     }, 1000)

  //     // Cleanup the timer
  //     return () => clearTimeout(timer)
  //   }
  // }, [status])

  if (status === 'loading') {
    return <Loading />
  }

  return children
}