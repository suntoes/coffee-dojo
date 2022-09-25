import { Box } from '@chakra-ui/react'

import { FaMousePointer, FaHandPointer } from 'react-icons/fa'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const cursorStyle = {
  color: '#cc9900',
  fontSize: 20,
  stroke: 'black',
  strokeWidth: 20,
  transform: 'translate3d(100px, 30px, 0px'
}

const CursorAnim = () => {
  const [pointed, setPointed] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setPointed(true)
    }, 1500)
  }, [])

  return (
    <Box
      display="flex"
      position="fixed"
      boxSize={'full'}
      justifyContent="center"
      alignItems="center"
    >
      <motion.div
        initial={{ x: 200, y: 200, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{
          duration: 2,
          ease: 'easeOut'
        }}
      >
        {pointed ? (
          <FaHandPointer style={cursorStyle} />
        ) : (
          <FaMousePointer style={cursorStyle} />
        )}
      </motion.div>
    </Box>
  )
}

export default CursorAnim
