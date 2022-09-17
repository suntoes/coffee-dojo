import { Box, Image } from '@chakra-ui/react'

export const CoffeeDojoLogo = ({ passRef }) => (
  <Box
    ref={passRef}
    marginY={'10px'}
    w={[85, 100, 125]}
    h={[85, 100, 125]}
    overflow="hidden"
  >
    <Image alt="Coffee Dojo" src="/images/coffee-dojo-logo.png" />
  </Box>
)

export const CoffeeDojoLogoSmall = () => (
  <Box marginY={'10px'} boxSize={[45, 55, 75]} overflow="hidden">
    <Image alt="Coffee Dojo" src="/images/coffee-dojo-logo.png" />
  </Box>
)
