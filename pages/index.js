import { Box } from '@chakra-ui/react'

import { useRef, useEffect, useState } from 'react'

import Layout from '../components/layouts/article'
import ImageBackground from '../components/image-background'
import PicStrip from '../components/pic-strip'
import { PrimaryTitle } from '../components/title'

const Home = ({ mainIgFeed, branchesData }) => {
  const [fullBoxH, setFullBoxH] = useState(1)
  const [picStripH, setPicStripH] = useState(1)
  const [yOffsetValue, setYOffsetValue] = useState(0)
  const [yTransformValue, setYTransformValue] = useState(0)
  const [midTriggerValue, setMidTriggerValue] = useState(0)
  const [midTriggerInitial, setMidTriggerInitial] = useState(0)
  const [stripOpacity, setStripOpacity] = useState(1)
  const [addPicStripArr, setAddPicStripArr] = useState([])

  const [breakCount, setBreakCount] = useState(0)
  const [onBreak, setOnBreak] = useState(false)
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0)
  const [transitionIsExit, setTransitionIsExit] = useState(false)
  const [docIsVisible, setDocIsVisible] = useState(true)

  const refs = useRef({})

  const msPerPixelScroll = 18

  const stopScroll = () => {
    clearInterval(localStorage.getItem('scrollInterval'))
    clearTimeout(localStorage.getItem('backgroundChangeTimeout'))
    clearTimeout(localStorage.getItem('scrollTimeout'))
  }

  const breakScroll = (prevYCount, prevBreakCount = 0, prevBgIndex = 0) => {
    if (!docIsVisible) return
    stopScroll()

    setOnBreak(true)
    setBreakCount(prevBreakCount + 1)

    setStripOpacity(0.3)
    setTimeout(() => {
      setStripOpacity(1)
    }, 2800)

    const newBgIndex = prevBgIndex + 1 < branchesData?.length ? prevBgIndex + 1 : 0

    const scrollTimeout = setTimeout(() => {
      setOnBreak(false)
      setTransitionIsExit(true)
      playScroll(false, prevYCount, prevBreakCount + 1, newBgIndex)

      const fixedMs = 7000 * (fullBoxH > 1000 ? 1 : fullBoxH/1500)
      const backgroundChangeTimeout = setTimeout(() => {
        setTransitionIsExit(false)
        setCurrentBackgroundIndex(newBgIndex)
      }, fixedMs)

      localStorage.setItem('backgroundChangeTimeout', backgroundChangeTimeout)
    }, 3000)

    localStorage.setItem('scrollTimeout', scrollTimeout)
  }

  const playScroll = (initial, prevYCount, prevBreakCount=0, prevBgIndex=0) => {
    stopScroll()
    let midTriggerCount = 0
    let midTriggerInitialCount = midTriggerInitial
    let yCount = prevYCount || yTransformValue

    const scrollInterval = setInterval(() => {
      yCount++
      if (yCount >= picStripH) yCount = 0
      const picStripNode = refs.current.picStrip
      picStripNode.style.transform = `translate3d(0px, ${yCount}px, 0px)`

      if (initial) {
        if (midTriggerInitialCount <= 1) {
          setMidTriggerInitial(0)
          breakScroll(yCount, prevBreakCount, prevBgIndex)
        }
        midTriggerInitialCount--
      } else {
        midTriggerCount++
        if (midTriggerCount >= midTriggerValue) {
          midTriggerCount = 0
          breakScroll(yCount, prevBreakCount, prevBgIndex)
        }
      }
    }, msPerPixelScroll)
    localStorage.setItem('scrollInterval', scrollInterval)
  }

  useEffect(() => {
    setOnBreak(false)
    setTransitionIsExit(false)
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
        setTransitionIsExit(false)
        setOnBreak(false)
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
    if (midTriggerInitial) playScroll(true)
  }, [midTriggerInitial])

  return (
    <>
      <Layout>
        {
          branchesData.map(({gDriveMainPic}, i) =>
            <ImageBackground
              key={`branch-background-${i}`}
              passRef={elem => {
                refs.current.fullBoxRef = elem
              }}
              opacity={i === currentBackgroundIndex && !transitionIsExit ? 1 : 0}
              transition={
                transitionIsExit ?
                "opacity 4000ms cubic-bezier(0, 0, 0.1, 1) 0s" : 
                "opacity 4000ms cubic-bezier(0.99, 0, 1, 1) 0s"
              }
              background={`url("https://drive.google.com/uc?export=view&id=${gDriveMainPic}") no-repeat center center fixed`}
            />
          )
        }
        {breakCount > 0 && (
          <PrimaryTitle
            zIndex={onBreak ? 99 : 1}
            city={branchesData[currentBackgroundIndex].city}
            motionKey={breakCount}
          />
        )}
        <Box
          zIndex={onBreak ? 1 : 99}
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
          />
        </Box>
      </Layout>
    </>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
