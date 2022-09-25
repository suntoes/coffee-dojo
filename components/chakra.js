import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager
} from '@chakra-ui/react'
import theme from '../lib/theme'

export default function Chakra({ cookies, children }) {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager

  return (
    <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  )
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}

export async function getServerSideProps({ req }) {
  const mainIgFeedRequest = await fetch(
    'https://coffee-dojo-api.onrender.com/api/ig/main'
  )
  const branchesDataRequest = await fetch(
    'https://coffee-dojo-api.onrender.com/api/ig/branches'
  )

  const { recentPosts } = (await mainIgFeedRequest.json()) || []
  const initialBranchesData = (await branchesDataRequest.json()) || []

  const branchesData = shuffle(initialBranchesData)

  const ensurePostCount = [
    ...recentPosts.slice(0, 12),
    ...Array(12 - recentPosts.slice(0, 12).length).fill(1)
  ]
  const mainIgFeed = []
  for (let i = 0; i < ensurePostCount.length; i++) {
    mainIgFeed.push(ensurePostCount[i])
    if ((i + 1) % 3 === 0) mainIgFeed.push(0)
  }

  return {
    props: {
      mainIgFeed,
      branchesData,
      cookies: req.headers.cookie ?? ''
    }
  }
}
