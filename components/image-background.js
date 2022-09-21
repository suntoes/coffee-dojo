import { Box } from '@chakra-ui/react'

const ImageBackground = ({ passRef, opacity, transition, background }) => (
  <Box
    ref={passRef}
    opacity={opacity}
    transition={transition}
    position="fixed"
    boxSize="full"
    zIndex={-1}
    background={background}
    backgroundSize="cover"
  />
)

export default ImageBackground
