import { Box, AspectRatio } from '@chakra-ui/react'

export const IgGridPic = ({ src }) => (
  <AspectRatio ratio={10 / 11} overflow="hidden">
    <iframe src={src + 'embed'} width={'105%'} />
  </AspectRatio>
)

export const IgSmallPic = ({ src }) => (
  <Box marginY={'10px'} w={[85, 100, 125]} h={[85, 100, 125]} overflow="hidden">
    <iframe
      src={src + 'embed'}
      width={'105%'}
      height={204}
      style={{ marginTop: -56 }}
      tabIndex={-1}
    />
  </Box>
)
