import { Box } from '@chakra-ui/react'

import { useRef, useEffect, useState } from 'react'

import Layout from '../components/layouts/article'
import ImageBackground from '../components/image-background'
import PicStrip from '../components/pic-strip'
import { PrimaryTitle } from '../components/title'

const Home = ({ mainIgFeed, branchesData }) => {
  const [fullBoxH, setFullBoxH] = useState(1)
  const [picStripH, setPicStripH] = useState(1)
  const [bgOpacity, setBgOpacity] = useState(0)
  const [yOffsetValue, setYOffsetValue] = useState(0)
  const [yTransformValue, setYTransformValue] = useState(0)
  const [midTriggerValue, setMidTriggerValue] = useState(0)
  const [midTriggerInitial, setMidTriggerInitial] = useState(0)
  const [stripOpacity, setStripOpacity] = useState(1)
  const [addPicStripArr, setAddPicStripArr] = useState([])

  const [breakCount, setBreakCount] = useState(0)
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0)
  const [docIsVisible, setDocIsVisible] = useState(true)

  const refs = useRef({})

  const msPerPixelScroll = 20

  const stopScroll = () => {
    clearInterval(localStorage.getItem('bgOpacityIntervalUndo'))
    clearInterval(localStorage.getItem('bgOpacityInterval'))
    clearInterval(localStorage.getItem('stripOpacityIntervalUndo'))
    clearInterval(localStorage.getItem('stripOpacityInterval'))
    clearInterval(localStorage.getItem('scrollInterval'))
    clearTimeout(localStorage.getItem('bgOpacityUndoTimeout'))
    clearTimeout(localStorage.getItem('stripOpacityUndoTimeout'))
    clearTimeout(localStorage.getItem('scrollTimeout'))
  }

  const breakScroll = prevYCount => {
    if (!docIsVisible) return
    stopScroll()

    setBreakCount(prev => prev + 1)

    let bgOpacityCount = 0.8

    const bgOpacityInterval = setInterval(() => {
      if (bgOpacityCount > 1) return clearInterval(bgOpacityInterval)
      bgOpacityCount += 0.02
      setBgOpacity(bgOpacityCount)
    }, 30)

    const bgOpacityUndoTimeout = setTimeout(() => {
      let bgOpacityCountUndo = 1
      const bgOpacityIntervalUndo = setInterval(() => {
        if (bgOpacityCountUndo < 0.8)
          return clearInterval(bgOpacityIntervalUndo)
        bgOpacityCountUndo -= 0.02
        setBgOpacity(bgOpacityCountUndo)
      }, 30)
      localStorage.setItem('bgOpacityIntervalUndo', bgOpacityIntervalUndo)
    }, 2670)

    let stripOpacityCount = 1

    const stripOpacityInterval = setInterval(() => {
      if (stripOpacityCount < 0.3) return clearInterval(stripOpacityInterval)
      stripOpacityCount -= 0.02
      setStripOpacity(stripOpacityCount)
    }, 20)

    setTimeout(() => {
      let stripOpacityCountUndo = 0.3
      const stripOpacityIntervalUndo = setInterval(() => {
        if (stripOpacityCountUndo > 1)
          return clearInterval(stripOpacityIntervalUndo)
        stripOpacityCountUndo += 0.02
        setStripOpacity(stripOpacityCountUndo)
      }, 30)
    }, 3000)

    const scrollTimeout = setTimeout(() => {
      playScroll({ prevYCount })
    }, 3000)

    localStorage.setItem('bgOpacityInterval', bgOpacityInterval)
    localStorage.setItem('bgOpacityUndoTimeout', bgOpacityUndoTimeout)
    localStorage.setItem('stripOpacityInterval', stripOpacityInterval)
    localStorage.setItem('scrollTimeout', scrollTimeout)
  }

  const playScroll = ({ initial, prevYCount } = { initial: false }) => {
    stopScroll()
    let midTriggerCount = 0
    let midTriggerInitialCount = midTriggerInitial
    let yCount = prevYCount || yTransformValue

    const getBgOpacity = count =>
      Math.round(Math.abs(count / (midTriggerValue / 2) - 1) * 100) / 100 - 0.2

    const scrollInterval = setInterval(() => {
      yCount++
      if (yCount >= picStripH) yCount = 0
      setYTransformValue(yCount)

      if (initial) {
        if (midTriggerInitialCount <= 1) {
          setMidTriggerInitial(0)
          breakScroll(yCount)
        }
        setBgOpacity(getBgOpacity(midTriggerInitialCount))
        midTriggerInitialCount--
      } else {
        setBgOpacity(getBgOpacity(midTriggerCount))
        midTriggerCount++
        if (midTriggerCount >= midTriggerValue) {
          midTriggerCount = 0
          breakScroll(yCount)
        }
      }
    }, msPerPixelScroll)
    localStorage.setItem('scrollInterval', scrollInterval)
  }

  const backgroundTriggerCallback = () => {
    const newBgIndex = currentBackgroundIndex + 1
    setCurrentBackgroundIndex(
      newBgIndex < branchesData?.length ? newBgIndex : 0
    )
  }

  useEffect(() => {
    setFullBoxH(refs.current.fullBoxRef?.clientHeight)
    setPicStripH(refs.current.picStripContainerRef.clientHeight)

    let windowResizeTimeout

    const resizeCallback = () => {
      clearTimeout(windowResizeTimeout)

      windowResizeTimeout = setTimeout(() => {
        setFullBoxH(refs.current?.fullBoxRef?.clientHeight)
        setPicStripH(
          refs.current?.picStripContainerRef?.clientHeight ||
            refs.current?.fullBoxRef?.clientHeight
        )
      }, 500)
    }

    window.addEventListener('resize', resizeCallback)

    const visibilityChangeCallback = () => {
      if (document.hidden) setDocIsVisible(false)
      else setDocIsVisible(true)
    }

    window.addEventListener('visibilitychange', visibilityChangeCallback)

    return () => {
      stopScroll()
      window.removeEventListener('resize', resizeCallback)
      window.removeEventListener('visibilitychange', visibilityChangeCallback)
    }
  }, [])

  useEffect(() => {
    stopScroll()

    const midTriggerIncrement = Math.round(
      (refs.current.lastLogoRef?.getBoundingClientRect().height + 20) / 2
    )
    const _midTriggerValue =
      refs.current.lastLogoRef?.getBoundingClientRect().y -
      refs.current.secToLastLogoRef?.getBoundingClientRect().y
    const _midTriggerInitial =
      _midTriggerValue -
      (Math.round(fullBoxH / 2) -
        Math.floor(Math.round(fullBoxH / 2) / _midTriggerValue) *
          _midTriggerValue)

    const multiplier = Math.ceil(fullBoxH / picStripH)
    const data = mainIgFeed
    const arr = []
    for (let c = 0; c < multiplier; c++) {
      arr.push(data)
    }

    setMidTriggerInitial(
      _midTriggerInitial !== Infinity
        ? _midTriggerInitial + midTriggerIncrement
        : 0
    )
    setMidTriggerValue(_midTriggerValue)
    setYOffsetValue(fullBoxH - picStripH)
    setYTransformValue(0)
    setAddPicStripArr(arr)
  }, [fullBoxH])

  useEffect(() => {
    if (midTriggerInitial) playScroll({ initial: true })
  }, [midTriggerInitial])

  return (
    <>
      <Layout>
        {branchesData?.map((cityObj, i) => (
          <ImageBackground
            key={`image-bg-${i}`}
            visibility={i === currentBackgroundIndex ? 'visible' : 'hidden'}
            passRef={elem => {
              refs.current.fullBoxRef = elem
            }}
            opacity={bgOpacity}
            background={`url("${
              'https://drive.google.com/uc?export=view&id=' +
              cityObj.gDriveMainPic
            }") no-repeat center center fixed`}
          />
        ))}
        {breakCount > 0 && (
          <PrimaryTitle
            zIndex={bgOpacity >= 1 ? 99 : 1}
            city={branchesData[currentBackgroundIndex].city}
            motionKey={breakCount}
          />
        )}
        <Box
          zIndex={bgOpacity < 1 ? 99 : 1}
          position={'fixed'}
          boxSize={'full'}
          background="none"
        >
          <PicStrip
            refs={refs}
            opacity={stripOpacity}
            picStripH={picStripH}
            yOffsetValue={yOffsetValue}
            yTransformValue={yTransformValue}
            mainIgFeed={mainIgFeed}
            addPicStripArr={addPicStripArr}
            backgroundTriggerPoint={Math.round(fullBoxH / 2)}
            backgroundTriggerCallback={backgroundTriggerCallback}
          />
        </Box>
      </Layout>
    </>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
