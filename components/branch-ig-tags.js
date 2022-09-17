import { SimpleGrid } from '@chakra-ui/react'
import { IgGridPic } from './ig-pic'

const BranchIgTags = ({ hidden, cityData }) => (
  <SimpleGrid
    display={hidden ? 'none' : 'grid'}
    columns={{ base: 2, md: 3 }}
    spacing={5}
  >
    {[...((cityData.igLocationPics || []).slice(0, 12) || [])].map((url, i) => (
      <IgGridPic key={`ig-grid-pic-${i}`} src={url} />
    ))}
  </SimpleGrid>
)

export default BranchIgTags
