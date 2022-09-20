import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import NextLink from 'next/link'

import { Box, Text, Container, Stack, Link } from '@chakra-ui/react'

import { motion, AnimatePresence } from 'framer-motion'

import Layout from '../../components/layouts/article'
import Navbar from '../../components/navbar'
import BranchInfo from '../../components/branch-info'
import BranchIgTags from '../../components/branch-ig-tags'

const City = ({ branchesData }) => {
  const router = useRouter()
  const { cityParams = '' } = router.query
  const [cityData, setCityData] = useState({})
  const [page, setPage] = useState(0)

  const titleCase = string =>
    string[0]?.toUpperCase() + string.slice(1)?.toLowerCase()

  useEffect(() => {
    const filterBranches = branchesData.filter(
      cityObj => titleCase(cityObj.city || '') === titleCase(cityParams || '')
    )
    setCityData(filterBranches[0] || {})
  }, [])

  return (
    <Layout title={titleCase(cityParams)}>
      <Navbar city={cityParams} />
      <Container
        maxW={1100}
        wrap="wrap"
        justifyContent="space-between"
        pb={5}
        paddingX={5}
      >
        <Stack
          mb={3}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
        >
          <NextLink href={'/'} passHref scroll={false}>
            <Link
              fontSize="0.8em"
              maxWidth="80px"
              color="#848484"
              letterSpacing={[0, 1, 2]}
              textUnderlineOffset={6}
            >
              {'< BACK'}
            </Link>
          </NextLink>
          <Box
            display="flex"
            justifyContent="center"
            w={{ base: '100%', md: '27.375%' }}
          >
            <Box
              display="flex"
              w="100%"
              maxWidth="150px"
              justifyContent="space-between"
            >
              {['INFO', 'IG TAGS'].map((str, i) => (
                <>
                  <Text
                    onClick={() => setPage(i)}
                    fontSize="0.8em"
                    fontWeight={i === page ? 900 : 400}
                    color={i === page ? 'initial' : '#848484'}
                    letterSpacing={i === page ? [2, 4, 6] : [0, 1, 2]}
                    textDecoration={i === page ? 'underline' : 'none'}
                    textUnderlineOffset={6}
                    cursor="pointer"
                  >
                    {str}
                  </Text>
                </>
              ))}
            </Box>
          </Box>
        </Stack>
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            key={page}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BranchInfo hidden={page !== 0} cityData={cityData} />
            <BranchIgTags hidden={page !== 1} cityData={cityData} />
          </motion.div>
        </AnimatePresence>
      </Container>
    </Layout>
  )
}

export default City
export { getServerSideProps } from '../../components/chakra'
