import { useEffect, useState } from 'react'
import { AspectRatio, Box, useColorModeValue } from '@chakra-ui/react'

import { motion, AnimatePresence } from 'framer-motion'

const variants = {
  enter: direction => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: direction => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    }
  }
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity
}

const Gallery = ({ images = [] }) => {
  const [[page, direction], setPage] = useState([0, 0])

  const paginate = newDirection => {
    let controlledPage
    let controlledDirection
    switch (true) {
      case page + newDirection < 0:
        controlledPage = images.length - 1
        controlledDirection = -1
        break
      case page + newDirection > images.length - 1:
        controlledPage = 0
        controlledDirection = 1
        break
      default:
        controlledPage = page + newDirection
        controlledDirection = newDirection
        break
    }
    console.log(page + newDirection, controlledPage, controlledDirection)
    setPage([controlledPage, newDirection])
  }

  useEffect(() => {
    clearTimeout(localStorage.getItem('autoSwipe'))
    const autoSwipe = setTimeout(() => {
      paginate(1)
    }, 5000)
    localStorage.setItem('autoSwipe', autoSwipe)
  }, [page])

  return (
    <AspectRatio
      width={{ base: '100%', md: '85%' }}
      height={{ base: '100%', md: '85%' }}
      ratio={1}
      overflow="hidden"
    >
      <AnimatePresence initial={false} custom={direction}>
        <Box
          display="flex"
          justifyContent="space-between !important"
          overflow="visible !important"
          transform={'translateX(-99999px)'}
          zIndex={99}
          width="100%"
        >
          <Box
            onClick={() => paginate(-1)}
            display="flex"
            color={useColorModeValue('#f3ece3', '#282828')}
            alignItems="center"
            justifyContent="center"
            fontSize="200%"
            cursor="pointer"
            transform={'translateX(99999px)'}
            width={{ base: '10%', md: '7%' }}
            height={{ base: '10%', md: '7%' }}
            bg="#cc990050"
            css={{ backdropFilter: 'blur(10px)' }}
          >
            {'<'}
          </Box>
          <Box
            onClick={() => paginate(1)}
            display="flex"
            color={useColorModeValue('#f3ece3', '#282828')}
            alignItems="center"
            justifyContent="center"
            fontSize="200%"
            cursor="pointer"
            transform={'translateX(99999px)'}
            width={{ base: '10%', md: '7%' }}
            height={{ base: '10%', md: '7%' }}
            css={{ backdropFilter: 'blur(10px)' }}
            bg="#cc990050"
          >
            {'>'}
          </Box>
        </Box>
        {images.map((url, i) => (
          <AnimatePresence key={`branch-img-${i}`}>
            <motion.img
              key={page}
              alt="Coffee Dojo"
              src={url}
              custom={direction}
              variants={variants}
              hidden={i !== page}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
            />
          </AnimatePresence>
        ))}
      </AnimatePresence>
    </AspectRatio>
  )
}

export default Gallery
