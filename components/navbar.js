import { useState } from 'react'

import {
  Container,
  Box,
  Link,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  Divider,
  Stack
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { SecondaryTitle } from './title'

export const BranchNavbar = props => {
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

export const BranchListNavbar = ({ branchesData }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <>
      <Box
        position="fixed"
        boxSize="full"
        bg="red"
        zIndex={100}
        w="100%"
        transform={{
          base: 'translateY(-88888px) translateY(83%)',
          md: 'translateY(-88888px) translateY(0%)'
        }}
      >
        <Container maxW={1100}>
          <Box
            display="flex"
            width="100%"
            px={{ base: 0, md: 0 }}
            justifyContent="end"
          >
            <Box
              display={{ base: 'block', md: 'flex' }}
              justifyContent={{ base: 'end', md: 'center' }}
              w={{ base: '', md: '28.375%' }}
            >
              <Button
                bg="#cc990050"
                borderRadius="none"
                transition="none"
                transform={{
                  base: 'rotate(-90deg) translate3d(-88888px, 63px, 0px)',
                  md: 'rotate(0deg) translate3d(0px, 88888px, 0px)'
                }}
                css={`
                  backdrop-filter: blur(10px);

                  &:hover {
                    text-decoration: underline;
                    text-underline-offset: 6px;
                  }
                `}
                onClick={() => setModalIsOpen(true)}
              >
                <Text
                  fontSize="0.7em"
                  fontWeight={900}
                  letterSpacing={[2, 4, 6]}
                >
                  BRANCH LIST
                </Text>
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Modal
        isOpen={modalIsOpen}
        blockScrollOnMount={false}
        onClose={() => setModalIsOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="none" boxShadow="none">
          <Container centerContent>
            <Stack direction="column" alignItems="center">
              {branchesData
                ?.map(({ city }) => city)
                ?.sort()
                ?.map((city, i) => (
                  <Link
                    color="#fff"
                    href={'/city/' + city?.toLowerCase()}
                    key={`branch-navlink-${i}`}
                  >
                    {city?.toUpperCase()} <ExternalLinkIcon mx="2px" />
                  </Link>
                ))}
              <Divider />
              <Link color="#fff" onClick={() => setModalIsOpen(false)}>
                Close
              </Link>
            </Stack>
          </Container>
        </ModalContent>
      </Modal>
    </>
  )
}

export { getServerSideProps } from './chakra'
