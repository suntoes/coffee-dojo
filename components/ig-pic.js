import { Box, AspectRatio } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

const IgSmallPicDynamic = ({
  src,
  yTransformValue,
  backgroundTriggerPoint,
  backgroundTriggerCallback
}) => {
  const IgSmallPicRef = useRef()

  useEffect(() => {
    const { y, height } = IgSmallPicRef.current.getBoundingClientRect()
    const triggerPoint = Math.round(y + (height + 20) / 2)
    if (triggerPoint === backgroundTriggerPoint) backgroundTriggerCallback()
  }, [yTransformValue])

  return (
    <Box
      ref={IgSmallPicRef}
      marginY={'10px'}
      w={[85, 100, 125]}
      h={[85, 100, 125]}
      overflow="hidden"
    >
      <iframe
        src={src + 'embed'}
        width={'105%'}
        height={204}
        style={{ marginTop: -56 }}
      />
    </Box>
  )
}

const IgSmallPicStatic = ({ src }) => (
  <Box marginY={'10px'} w={[85, 100, 125]} h={[85, 100, 125]} overflow="hidden">
    <iframe
      src={src + 'embed'}
      width={'105%'}
      height={204}
      style={{ marginTop: -56 }}
    />
  </Box>
)

export const IgGridPic = ({ src }) => (
  <AspectRatio ratio={10 / 11} overflow="hidden">
    <iframe src={src + 'embed'} width={'105%'} />
  </AspectRatio>
)

export const IgSmallPic = props =>
  props.static ? (
    <IgSmallPicStatic {...props} />
  ) : (
    <IgSmallPicDynamic {...props} />
  )
