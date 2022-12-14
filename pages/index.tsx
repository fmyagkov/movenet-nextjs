import type { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@material-tailwind/react'
import React from 'react'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Link href="/movenetdemo">
        <Button>Start MoveNet App</Button>
      </Link>
    </div>
  )
}

export default Home
