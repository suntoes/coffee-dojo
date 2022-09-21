import Head from 'next/head'
import { Box } from '@chakra-ui/react'

const Main = ({ children }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A Japanese inspired coffee shop." />
        <meta name="author" content="Mar Santos" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:title" content="Coffee Dojo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="Coffee Dojo" />
        <meta name="twitter:creator" content="Coffee Dojo" />
        <meta name="twitter:image" content="https://www.coffee-dojo.com/card.png" />
        <meta name="og:title" content="Coffee Dojo" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.coffee-dojo.com/card.png" />
        <meta property="og:description" content="A Japanese inspired coffee shop." />
        <title>Coffee Dojo</title>
      </Head>

      {children}
    </Box>
  )
}

export default Main
