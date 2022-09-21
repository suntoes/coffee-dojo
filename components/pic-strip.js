import { Container } from '@chakra-ui/react'

import { IgSmallPic } from './ig-pic'
import { CoffeeDojoLogo } from './logo'

const PicSubStrip = ({ passRef, transform, children }) => (
  <Container
    ref={passRef}
    position="absolute"
    transform={transform}
    centerContent
  >
    {children}
  </Container>
)

const PicStrip = ({
  refs,
  opacity,
  picStripH,
  yOffsetValue,
  yTransformValue,
  mainIgFeed,
  addPicStripArr,
  backgroundTriggerPoint,
  backgroundTriggerCallback
}) => (
  <Container
    ref={elem => {
      refs.current.picStrip = elem
    }}
    opacity={opacity}
    transition="opacity 1500ms"
    centerContent
  >
    <PicSubStrip
      passRef={elem => {
        refs.current.picStripContainerRef = elem
      }}
      key="pic-strip-0"
      transform={`translateY(${picStripH * -0 + yOffsetValue}px)`}
    >
      {mainIgFeed?.map((url, _i) =>
        url === 0 ? (
          <CoffeeDojoLogo
            passRef={elem => {
              if (_i === 11) {
                refs.current.secToLastLogoRef = elem
              } else if (_i === 15) {
                refs.current.lastLogoRef = elem
              } else return undefined
            }}
            key={`sub-pic-strip-0-${_i}`}
          />
        ) :
        url === 1 ? (
          <CoffeeDojoLogo key={`sub-pic-strip-0-${_i}`} />
        ) : (
          (_i + 1) % 2 === 0 ? (
            <IgSmallPic
              yTransformValue={yTransformValue}
              key={`sub-pic-strip-0-${_i}`}
              src={url}
              backgroundTriggerPoint={backgroundTriggerPoint}
              backgroundTriggerCallback={backgroundTriggerCallback}
            />
          ) : (
            <IgSmallPic key={`sub-pic-strip-0-${_i}`} src={url} />
          )
        )
      )}
    </PicSubStrip>

    {addPicStripArr.map((subPicStripArr, i) => (
      <PicSubStrip
        key={`pic-strip-${i + 1}`}
        transform={`translateY(${picStripH * -(i + 1) + yOffsetValue}px)`}
      >
        {subPicStripArr?.map((url, _i) =>
          url === 0 ? (
            <CoffeeDojoLogo key={`sub-pic-strip-${i + 1}-${_i}`} />
          ) :
          url === 1 ? (
            <CoffeeDojoLogo key={`sub-pic-strip-${i + 1}-${_i}`} />
          ) : (
            (_i + 1) % 2 === 0 ? (
              <IgSmallPic
                yTransformValue={yTransformValue}
                key={`sub-pic-strip-0-${_i}`}
                src={url}
                backgroundTriggerPoint={backgroundTriggerPoint}
                backgroundTriggerCallback={backgroundTriggerCallback}
              />
            ) : (
              <IgSmallPic key={`sub-pic-strip-0-${_i}`} src={url} />
            )
          )
        )}
      </PicSubStrip>
    ))}
  </Container>
)

export default PicStrip
