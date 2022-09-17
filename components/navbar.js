import { Container, Box } from '@chakra-ui/react'

import { SecondaryTitle } from './title'

const Navbar = props => {
  const { city } = props

  return (
    <Box as="nav" w="100%">
      <Container
        display="flex"
        maxW={1100}
        wrap="wrap"
        align="center"
        justifyContent={{ base: 'center', md: 'start' }}
        paddingX={5}
      >
        <SecondaryTitle city={city || ''} />
      </Container>
    </Box>
  )
}

export default Navbar
