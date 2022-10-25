import type { NextPage } from 'next'
import { Button } from '@material-tailwind/react'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Button>Start MoveNet App</Button>
    </div>
  )
}

export default Home
