import { Box } from '@chakra-ui/react'

const ImageBackground = ({ passRef, visibility, opacity, background }) => (
  <Box
    ref={passRef}
    visibility={visibility}
    opacity={opacity}
    position="fixed"
    boxSize="full"
    zIndex={-1}
    background={background}
    backgroundSize="cover"
  />
)

export default ImageBackground
