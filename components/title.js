import { useRouter } from 'next/router'

import { useState } from 'react'

import { Box, Heading, LinkBox } from '@chakra-ui/react'

import { CoffeeDojoLogo, CoffeeDojoLogoSmall } from './logo'
import { motion } from 'framer-motion'

export const PrimaryTitle = ({ city, motionKey, zIndex }) => {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const linkProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick: () => {
      localStorage.setItem('kohi-dojo-first-visit', false)
      router.push(`/city/${city?.toLowerCase()}`)
    },
    cursor: 'pointer',
    css: hovered
      ? `text-decoration: underline; text-underline-offset: 6px;`
      : ``
  }

  return (
    <Box
      display="flex"
      position="fixed"
      zIndex={zIndex}
      justifyContent="center"
      alignItems="center"
      bg="none"
      boxSize="full"
    >
      <Box
        display="flex"
        width="full"
        justifyContent="center"
        alignItems="center"
      >
        <Heading
          {...linkProps}
          as="h1"
          width="40%"
          letterSpacing={[3, 6, 8]}
          color={'white'}
          textAlign="right"
          fontSize={['0.8em', '1.25em', '1.5em']}
        >
          <motion.div
            key={motionKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3.5,
              times: [0, 0.2, 0.8, 1]
            }}
          >
            <a>COFFEE DOJO</a>
          </motion.div>
        </Heading>
        <motion.div
          key={motionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 3,
            times: [0, 0.1, 0.9, 1]
          }}
        >
          <LinkBox {...linkProps}>
            <CoffeeDojoLogo />
          </LinkBox>
        </motion.div>
        <Heading
          {...linkProps}
          as="h1"
          width="40%"
          pl={['3px', '6px', '8px']}
          letterSpacing={[3, 6, 8]}
          color={'white'}
          fontSize={['0.8em', '1.25em', '1.5em']}
        >
          <motion.div
            key={motionKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3.5,
              times: [0, 0.2, 0.8, 1]
            }}
          >
            <a>{(city || '').toUpperCase()}</a>
          </motion.div>
        </Heading>
      </Box>
    </Box>
  )
}

export const SecondaryTitle = ({ city }) => (
  <Box display="flex" justifyContent="center" alignItems="center">
    <Heading
      as="h1"
      letterSpacing={[3, 6, 8]}
      textAlign="right"
      fontSize={['0.8em', '0.9em', '1em']}
    >
      <a>COFFEE DOJO</a>
    </Heading>
    <LinkBox>
      <CoffeeDojoLogoSmall />
    </LinkBox>
    <Heading
      as="h1"
      pl={['3px', '6px', '8px']}
      letterSpacing={[3, 6, 8]}
      fontSize={['0.8em', '0.9em', '1em']}
    >
      <a>{(city || '').toUpperCase()}</a>
    </Heading>
  </Box>
)
