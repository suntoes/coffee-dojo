import { Box } from '@chakra-ui/react'

import { useRef, useEffect, useState } from 'react'

import Layout from '../components/layouts/article'
import ImageBackground from '../components/image-background'
import PicStrip from '../components/pic-strip'
import { PrimaryTitle } from '../components/title'
import CursorAnim from '../components/cursor-animation'
import { BranchListNavbar } from '../components/navbar'

const Home = ({ mainIgFeed, branchesData }) => {
  const refs = useRef({})
  const [userFirstVisit, setUserFirstVisit] = useState(false)

  const [fullBoxH, setFullBoxH] = useState(1)
  const [picStripH, setPicStripH] = useState(1)

  const [yOffsetValue, setYOffsetValue] = useState(0)
  const [midTriggerValue, setMidTriggerValue] = useState(0)
  const [midTriggerInitial, setMidTriggerInitial] = useState(0)
  const [stripOpacity, setStripOpacity] = useState(1)
  const [addPicStripArr, setAddPicStripArr] = useState([])

  const [breakCount, setBreakCount] = useState(0)
  const [onBreak, setOnBreak] = useState(false)
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(-1)
  const [transitionIsExit, setTransitionIsExit] = useState(true)
  const [docIsVisible, setDocIsVisible] = useState(true)

  const scrollMs = 5000

  const stopScroll = () => {
    clearTimeout(localStorage.getItem('breakScrollTimer'))
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

    const newBgIndex =
      prevBgIndex + 1 < branchesData?.length ? prevBgIndex + 1 : 0

    const scrollTimeout = setTimeout(() => {
      const fixedMs = Math.round(scrollMs / 2)
      const nextMode =
        prevYCount + midTriggerValue > picStripH ? 'last' : 'normal'

      setOnBreak(false)
      setTransitionIsExit(true)
      playScroll(nextMode, prevYCount, prevBreakCount + 1, newBgIndex)

      const backgroundChange = () => {
        setTransitionIsExit(false)
        setCurrentBackgroundIndex(newBgIndex)
      }
      const backgroundChangeTimeout = setTimeout(backgroundChange, fixedMs)
      localStorage.setItem('backgroundChangeTimeout', backgroundChangeTimeout)
    }, 3000)

    localStorage.setItem('scrollTimeout', scrollTimeout)
  }

  const playScroll = (
    mode,
    prevYCount = 0,
    prevBreakCount = 0,
    prevBgIndex = 0
  ) => {
    // Clean timeouts
    stopScroll()

    // Bg rule for initial
    if (mode === 'initial') {
      setTimeout(() => {
        setTransitionIsExit(false)
        setCurrentBackgroundIndex(prevBgIndex)
      }, Math.round((midTriggerInitial / midTriggerValue) * scrollMs))
    }

    // Solve with mode variants
    const picStripNode = refs.current.picStrip
    let yCount = prevYCount
    let msToServe

    const initialNormalCallback = () => {
      const breakScrollTimer = setTimeout(
        () => breakScroll(yCount, prevBreakCount, prevBgIndex),
        msToServe
      )
      localStorage.setItem('breakScrollTimer', breakScrollTimer)

      // Apply to DOM
      picStripNode.style.transition = `opacity 1500ms, transform ${msToServe}ms linear 0ms`
      picStripNode.style.transform = `translate3d(0px, ${yCount}px, 0px)`
    }

    const lastCallback = () => {
      // Apply to DOM
      picStripNode.style.transition = `opacity 1500ms, transform ${msToServe}ms linear 0ms`
      picStripNode.style.transform = `translate3d(0px, ${yCount}px, 0px)`

      const newBgIndex =
        prevBgIndex + 1 < branchesData?.length ? prevBgIndex + 1 : 0
      const lastScrollTimer = setTimeout(() => {
        stopScroll()
        // Reset DOM
        picStripNode.style.transition = `opacity 1500ms, transform ${0}ms linear 0ms`
        picStripNode.style.transform = `translate3d(0px, ${0}px, 0px)`
        playScroll('repeat', 0, prevBreakCount + 1, newBgIndex)
      }, msToServe)
      localStorage.setItem('lastScrollTimer', lastScrollTimer)
    }

    const repeatCallback = () => {
      const breakScrollTimer = setTimeout(
        () => breakScroll(yCount, prevBreakCount, prevBgIndex),
        msToServe
      )
      localStorage.setItem('breakScrollTimer', breakScrollTimer)

      // Apply to DOM
      picStripNode.style.transition = `opacity 1500ms, transform ${0}ms linear 0ms`
      picStripNode.style.transform = `translate3d(0px, ${yCount}px, 0px)`
    }

    switch (true) {
      case mode === 'initial':
        yCount += midTriggerInitial
        msToServe = (midTriggerInitial / midTriggerValue) * scrollMs
        initialNormalCallback()
        break
      case mode === 'normal':
        yCount += midTriggerValue
        msToServe = scrollMs
        initialNormalCallback()
        break
      case mode === 'last':
        const difference =
          Math.round(picStripH - prevYCount) + midTriggerInitial
        yCount += difference
        msToServe = Math.round(difference / midTriggerValue) * scrollMs
        lastCallback()
        break
      case mode === 'repeat':
        yCount += midTriggerInitial
        repeatCallback()
        break
    }
  }

  // Get initial state variables and add some listener
  useEffect(() => {
    const firstVisit = localStorage.getItem('kohi-dojo-first-visit')

    if (firstVisit) setUserFirstVisit(false)
    else setUserFirstVisit(true)

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
        setTransitionIsExit(true)
        setOnBreak(false)
      }, 500)
    }

    const visibilityChangeCallback = () => {
      if (document.hidden) setDocIsVisible(false)
      else setDocIsVisible(true)
    }

    window.addEventListener('resize', resizeCallback)
    window.addEventListener('visibilitychange', visibilityChangeCallback)

    return () => {
      stopScroll()
      window.removeEventListener('resize', resizeCallback)
      window.removeEventListener('visibilitychange', visibilityChangeCallback)
    }
  }, [])

  // Get state variables needed to recurse computation
  useEffect(() => {
    stopScroll()
    const picStripNode = refs.current.picStrip
    picStripNode.style.transition = `opacity 1500ms, transform ${0}ms linear 0ms`
    picStripNode.style.transform = `translate3d(0px, ${0}px, 0px)`

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
        ? _midTriggerInitial + midTriggerIncrement > _midTriggerValue
          ? _midTriggerInitial + midTriggerIncrement - _midTriggerValue
          : _midTriggerInitial + midTriggerIncrement
        : 0
    )
    setMidTriggerValue(_midTriggerValue)
    setYOffsetValue(fullBoxH - picStripH)
    setAddPicStripArr(arr)
  }, [fullBoxH])

  // Make sure a key variable exists before recursing animation
  useEffect(() => {
    if (midTriggerInitial) playScroll('initial')
  }, [midTriggerInitial])

  return (
    <>
      <Layout>
        <BranchListNavbar branchesData={branchesData} />
        {onBreak && userFirstVisit ? (
          <CursorAnim animKey={breakCount} />
        ) : (
          <></>
        )}
        {branchesData.map(({ gDriveMainPic }, i) => (
          <ImageBackground
            key={`branch-background-${i}`}
            passRef={elem => {
              refs.current.fullBoxRef = elem
            }}
            opacity={i === currentBackgroundIndex && !transitionIsExit ? 1 : 0}
            transition={
              transitionIsExit
                ? `opacity ${Math.round(
                    scrollMs * 0.4
                  )}ms cubic-bezier(0, 0, 0.1, 1) 0s`
                : `opacity ${Math.round(
                    scrollMs * 0.4
                  )}ms cubic-bezier(0.99, 0, 1, 1) 500ms`
            }
            background={`url("https://drive.google.com/uc?export=view&id=${gDriveMainPic}") no-repeat center center fixed`}
          />
        ))}
        {onBreak && (
          <PrimaryTitle
            zIndex={onBreak ? 99 : 1}
            city={branchesData[currentBackgroundIndex]?.city}
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
