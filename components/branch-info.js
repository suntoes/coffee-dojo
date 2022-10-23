import { AspectRatio, Box, Heading, Stack, Text, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import Gallery from './gallery'

const AddressSection = ({ cityData }) => (
  <>
    <Heading
      as="h3"
      fontSize="1em"
      fontWeight={900}
      letterSpacing={[2, 4, 6]}
      mb={1}
      mt={{ base: 7, md: 0 }}
    >
      ADDRESS
    </Heading>
    {cityData.gMapEmbedSrc && (
      <AspectRatio
        width={{ base: '70%', md: '100%' }}
        ratio={16 / 9}
        mb={2}
        mt={1}
      >
        <iframe src={cityData.gMapEmbedSrc} tabIndex={-1} />
      </AspectRatio>
    )}
    {cityData.address && (
      <Text
        fontSize="1em"
        color="#848484"
        whiteSpace="pre-wrap"
        letterSpacing={[0, 1, 2]}
      >
        {cityData.address}
      </Text>
    )}
  </>
)

const InfoSection = ({ cityData }) => (
  <>
    {cityData.information?.map(({ title, description }) => (
      <>
        <Heading
          as="h3"
          fontSize="1em"
          fontWeight={900}
          letterSpacing={[2, 4, 6]}
          mt={7}
          mb={1}
        >
          {(title || '').toUpperCase()}
        </Heading>
        <Text
          fontSize="1em"
          color="#848484"
          whiteSpace="pre-wrap"
          letterSpacing={[0, 1, 2]}
        >
          {description}
        </Text>
      </>
    ))}
  </>
)

const SocialSection = ({ cityData }) => (
  <>
    <Heading
      as="h3"
      fontSize="1em"
      fontWeight={900}
      letterSpacing={[2, 4, 6]}
      mt={7}
      mb={1}
    >
      SOCIALS
    </Heading>
    {cityData.socials?.map(({ title, link }, i) => (
      <Link key={`social-link-${i}`} href={link}>
        <Text
          fontSize="1em"
          color="#848484"
          whiteSpace="pre-wrap"
          letterSpacing={[0, 1, 2]}
        >
          {title}
          <ExternalLinkIcon mx="2px" />
        </Text>
      </Link>
    ))}
  </>
)

const BranchInfo = ({ hidden, cityData }) => (
  <Stack
    display={hidden ? 'none' : 'flex'}
    direction={{ base: 'column', md: 'row' }}
  >
    <Gallery
      images={cityData.gDriveBranchPics?.map(
        picId => 'https://drive.google.com/uc?export=view&id=' + picId
      )}
    />
    <Box fontSize={'0.7em'} paddingX={5} width={{ base: '100%', md: '30%' }}>
      {cityData.address || cityData.gMapEmbedSrc && <AddressSection cityData={cityData} />}

      {(cityData.information || []).length > 0 && (
        <InfoSection cityData={cityData} />
      )}

      {(cityData.socials || []).length > 0 && (
        <SocialSection cityData={cityData} />
      )}
    </Box>
  </Stack>
)

export default BranchInfo
