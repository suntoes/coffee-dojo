import { Box } from '@chakra-ui/react'

const ImageBackground = ({ passRef, opacity, background }) => (
  <Box
    ref={passRef}
    opacity={opacity}
    position="fixed"
    boxSize="full"
    zIndex={-1}
    background={background}
    backgroundSize="cover"
  />
)

export default ImageBackground
