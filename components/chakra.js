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

export async function getServerSideProps({ req }) {
  const mainIgFeedRequest = await fetch(
    'https://coffee-dojo-api-v1.herokuapp.com/api/ig/main'
  )
  const branchesDataRequest = await fetch(
    'https://coffee-dojo-api-v1.herokuapp.com/api/ig/branches'
  )

  const { recentPosts } = (await mainIgFeedRequest.json()) || []
  const branchesData = (await branchesDataRequest.json()) || {}

  const EnsurePostCount = [...recentPosts.slice(0, 12), ...Array(12 - recentPosts.slice(0, 12).length).fill(1)]

  const mainIgFeed = []
  for (let i = 0; i < EnsurePostCount.length; i++) {
    mainIgFeed.push(EnsurePostCount[i])
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
