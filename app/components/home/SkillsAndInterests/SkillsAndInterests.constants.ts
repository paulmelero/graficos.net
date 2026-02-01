export const RELATED_TO = {
  ART: 0,
  NATURE: 1,
  TECHNOLOGY: 2,
} as const

export const skillsAndInterestsDirectlyRelatedTo = {
  [RELATED_TO.ART]: ['Drawing', 'Graffiti', 'Music', 'Films'],
  [RELATED_TO.NATURE]: ['Hiking', 'Biking', 'Camping'],
  [RELATED_TO.TECHNOLOGY]: ['Web Development', 'AI & Machine Learning', 'Open Source Contribution', 'Tech Blogging'],
} as const

// now, some interests sit in between two categories
export const skillsAndInterestsIndirectlyRelatedToArtAndNature = ['Traveling', 'Gardening', 'Plants'] as const
export const skillsAndInterestsIndirectlyRelatedToArtAndTechnology = ['Maths', 'Game Development'] as const
export const skillsAndInterestsIndirectlyRelatedToNatureAndTechnology = [
  'Physics',
  'Astronomy',
  'Applied Mathematics',
] as const
export const skillsAndInterestsIndirectlyRelatedToAll = ['Cooking', 'Randomness'] as const

export const skillsAndInterestsPerCategory = {
  [RELATED_TO.ART]: [
    ...skillsAndInterestsDirectlyRelatedTo[RELATED_TO.ART],
    ...skillsAndInterestsIndirectlyRelatedToArtAndNature,
    ...skillsAndInterestsIndirectlyRelatedToArtAndTechnology,
    ...skillsAndInterestsIndirectlyRelatedToAll,
  ],
  [RELATED_TO.NATURE]: [
    ...skillsAndInterestsDirectlyRelatedTo[RELATED_TO.NATURE],
    ...skillsAndInterestsIndirectlyRelatedToArtAndNature,
    ...skillsAndInterestsIndirectlyRelatedToNatureAndTechnology,
    ...skillsAndInterestsIndirectlyRelatedToAll,
  ],
  [RELATED_TO.TECHNOLOGY]: [
    ...skillsAndInterestsDirectlyRelatedTo[RELATED_TO.TECHNOLOGY],
    ...skillsAndInterestsIndirectlyRelatedToArtAndTechnology,
    ...skillsAndInterestsIndirectlyRelatedToNatureAndTechnology,
    ...skillsAndInterestsIndirectlyRelatedToAll,
  ],
} as const
