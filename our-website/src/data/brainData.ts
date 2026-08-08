export interface BrainSection {
  id: string;
  index: number;
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  functions: string[];
  stat: string;
  statLabel: string;
  accent: string;
  accentSoft: string;
  icon: string;
  /** Deep/internal structures get the x-ray treatment (brain fades to reveal them). */
  deep?: boolean;
  /** 3D marker position on the normalized model (front = -Z, back = +Z, up = +Y) */
  marker: [number, number, number];
  /** Base camera position for this section */
  camera: [number, number, number];
  /** Base model rotation Y for this section */
  rotY: number;
}

export const brainSections: BrainSection[] = [
  {
    id: 'frontal',
    index: 1,
    eyebrow: 'Region 01',
    title: 'Frontal Lobe',
    tagline: 'The seat of who you are',
    description:
      'Behind your forehead sits the brain\u2019s executive suite. It plans, decides, and shapes the personality your friends would recognise in a second. When this region is injured, character changes more than memory does.',
    functions: [
      'Executive control and planning',
      'Decision-making and judgement',
      'Personality and social behaviour',
      'Speech production \u2014 Broca\u2019s area',
    ],
    stat: '41%',
    statLabel: 'of brain volume \u2014 the largest lobe',
    accent: '#8b5cf6',
    accentSoft: 'rgba(139, 92, 246, 0.16)',
    icon: 'compass',
    marker: [0, 0.5, -1.15],
    camera: [0, 1.2, -5.4],
    rotY: 0,
  },
  {
    id: 'parietal',
    index: 2,
    eyebrow: 'Region 02',
    title: 'Parietal Lobe',
    tagline: 'Your map of the world',
    description:
      'This region stitches touch, pressure and temperature into a single sense of space. It is why you can catch a ball mid-flight, feel a whisper on your neck, and know where your hand is with your eyes closed.',
    functions: [
      'Touch, pressure and temperature',
      'Spatial awareness and navigation',
      'Body sense \u2014 proprioception',
      'Mathematical reasoning',
    ],
    stat: '19%',
    statLabel: 'of brain volume',
    accent: '#22d3ee',
    accentSoft: 'rgba(34, 211, 238, 0.16)',
    icon: 'target',
    marker: [0, 0.95, 0.05],
    camera: [0.8, 4.6, -1.6],
    rotY: -0.5,
  },
  {
    id: 'temporal',
    index: 3,
    eyebrow: 'Region 03',
    title: 'Temporal Lobe',
    tagline: 'The archive of your life',
    description:
      'Sound becomes meaning, faces become names, and moments become memories here. Buried inside, the hippocampus is where your autobiography is written \u2014 and where it is lost in Alzheimer\u2019s disease.',
    functions: [
      'Hearing and language comprehension',
      'Memory formation \u2014 hippocampus',
      'Face and object recognition',
      'Emotional association',
    ],
    stat: '22%',
    statLabel: 'of brain volume',
    accent: '#fbbf24',
    accentSoft: 'rgba(251, 191, 36, 0.16)',
    icon: 'book',
    marker: [0.85, -0.05, 0.25],
    camera: [5.2, 0.9, 0.8],
    rotY: 0.55,
  },
  {
    id: 'occipital',
    index: 4,
    eyebrow: 'Region 04',
    title: 'Occipital Lobe',
    tagline: 'The theatre of vision',
    description:
      'The smallest of the four lobes, yet the most densely packed. Every scene you have ever witnessed \u2014 every sunset, every face \u2014 was assembled here from raw light in a fraction of a second.',
    functions: [
      'Visual processing and perception',
      'Colour and motion detection',
      'Depth and pattern recognition',
      'Reading and word recognition',
    ],
    stat: '18%',
    statLabel: 'of brain volume',
    accent: '#34d399',
    accentSoft: 'rgba(52, 211, 153, 0.16)',
    icon: 'eye',
    marker: [0, 0.15, 1.18],
    camera: [0, 1.0, 5.6],
    rotY: 0.2,
  },
  {
    id: 'cerebellum',
    index: 5,
    eyebrow: 'Region 05',
    title: 'Cerebellum',
    tagline: 'The precision engine',
    description:
      'Ten percent of the brain\u2019s volume, yet more than half of its neurons. It rehearses every movement in endless silent loops, which is why riding a bike stays effortless years after you last tried.',
    functions: [
      'Balance and posture',
      'Motor coordination and timing',
      'Motor learning \u2014 skill acquisition',
      'Speech articulation',
    ],
    stat: '10%',
    statLabel: 'of volume \u2014 but over half of all neurons',
    accent: '#fb7185',
    accentSoft: 'rgba(251, 113, 133, 0.16)',
    icon: 'activity',
    marker: [0, -0.45, 1.0],
    camera: [-3.0, -1.2, 4.4],
    rotY: 0.3,
  },
  {
    id: 'brainstem',
    index: 6,
    eyebrow: 'Region 06',
    title: 'Brainstem',
    tagline: 'The bridge of life',
    description:
      'No thoughts, no will \u2014 only the relentless machinery of staying alive. From this ancient core, the brain regulates the breath in your lungs and the beat of your heart, even while you sleep.',
    functions: [
      'Breathing and heart rate',
      'Sleep\u2013wake cycles',
      'Consciousness and arousal',
      'Relay station for every signal',
    ],
    stat: '2%',
    statLabel: 'of brain volume \u2014 and the first to form',
    accent: '#60a5fa',
    accentSoft: 'rgba(96, 165, 250, 0.16)',
    icon: 'pulse',
    marker: [0, -0.9, 0.3],
    camera: [0.4, -3.4, 3.2],
    rotY: 0.6,
  },
  {
    id: 'corpus-callosum',
    index: 7,
    eyebrow: 'Deep structure',
    title: 'Corpus Callosum',
    tagline: 'The information superhighway',
    deep: true,
    description:
      'A dense bridge of roughly 200 million nerve fibres stitching the two hemispheres together. Without it, your left hand literally would not know what your right hand is doing.',
    functions: [
      'Interhemispheric communication',
      'Coordinating left and right brains',
      'Transferring motor and sensory data',
      'Language lateralisation support',
    ],
    stat: '200M',
    statLabel: 'axons crossing between hemispheres',
    accent: '#d946ef',
    accentSoft: 'rgba(217, 70, 239, 0.16)',
    icon: 'layers',
    marker: [0, 0.55, 0.15],
    camera: [0, 1.6, -5.0],
    rotY: 0.1,
  },
  {
    id: 'hippocampus',
    index: 8,
    eyebrow: 'Deep structure',
    title: 'Hippocampus',
    tagline: 'The librarian of memory',
    deep: true,
    description:
      'Two seahorse-shaped structures deep inside each temporal lobe. They are the inkwell of your autobiography \u2014 every new memory is dipped into them before being filed across the cortex for the long term.',
    functions: [
      'Forming new memories',
      'Spatial navigation and maps',
      'Contextual and episodic memory',
      'Consolidation during sleep',
    ],
    stat: '2',
    statLabel: 'seahorse-shaped structures \u2014 one per hemisphere',
    accent: '#f472b6',
    accentSoft: 'rgba(244, 114, 182, 0.16)',
    icon: 'anchor',
    marker: [-0.55, -0.15, 0.5],
    camera: [-4.6, 0.5, 1.6],
    rotY: 0.85,
  },
  {
    id: 'amygdala',
    index: 9,
    eyebrow: 'Deep structure',
    title: 'Amygdala',
    tagline: 'The alarm system',
    deep: true,
    description:
      'Two almond-shaped clusters that scan every experience for danger, always a step ahead of conscious thought. It is why a shadow can make you flinch before you know what you saw.',
    functions: [
      'Fear and threat detection',
      'Emotional responses',
      'Emotional memory storage',
      'Social signal processing',
    ],
    stat: '100ms',
    statLabel: 'from seeing a threat to reacting',
    accent: '#ef4444',
    accentSoft: 'rgba(239, 68, 68, 0.16)',
    icon: 'flame',
    marker: [-0.6, -0.3, 0.35],
    camera: [-4.8, -0.5, 0.8],
    rotY: 1.05,
  },
  {
    id: 'thalamus',
    index: 10,
    eyebrow: 'Deep structure',
    title: 'Thalamus',
    tagline: 'The relay station',
    deep: true,
    description:
      'The gateway every sensory signal \u2014 except smell \u2014 must pass through on its way to the cortex. It filters, prioritises and routes the torrent of incoming data before you ever perceive it.',
    functions: [
      'Sensory relay hub',
      'Filtering and prioritising signals',
      'Regulating consciousness and sleep',
      'Motor signal relay',
    ],
    stat: '98%',
    statLabel: 'of sensory input passes through it',
    accent: '#a3e635',
    accentSoft: 'rgba(163, 230, 53, 0.16)',
    icon: 'spark',
    marker: [0, 0.18, 0.42],
    camera: [0.3, 1.9, -4.4],
    rotY: 0.15,
  },
  {
    id: 'hypothalamus',
    index: 11,
    eyebrow: 'Deep structure',
    title: 'Hypothalamus',
    tagline: 'The body\u2019s thermostat',
    deep: true,
    description:
      'Smaller than a grape, yet it runs the chemical board of the whole body. Hunger, thirst, temperature and hormones all report to this pocket of tissue just above the pituitary gland.',
    functions: [
      'Regulating hunger and thirst',
      'Body temperature control',
      'Sleep\u2013wake rhythms',
      'Hormone control via the pituitary',
    ],
    stat: '37°C',
    statLabel: 'kept steady regardless of the outside world',
    accent: '#f97316',
    accentSoft: 'rgba(249, 115, 22, 0.16)',
    icon: 'sprout',
    marker: [0, -0.15, 0.5],
    camera: [0.3, -0.4, -5.0],
    rotY: 0.25,
  },
  {
    id: 'midbrain',
    index: 12,
    eyebrow: 'Deep structure',
    title: 'Midbrain & Pons',
    tagline: 'The reflex core',
    deep: true,
    description:
      'The upper brainstem where instinct outruns thought. Here the midbrain snaps your head toward sudden sounds and flashes, while the pons keeps sleep cycling and rehearses your most automatic movements.',
    functions: [
      'Visual and auditory reflexes',
      'Eye movement control',
      'REM sleep and arousal \u2014 pons',
      'Automatic movement patterns',
    ],
    stat: '80ms',
    statLabel: 'reflex response \u2014 faster than conscious thought',
    accent: '#818cf8',
    accentSoft: 'rgba(129, 140, 248, 0.16)',
    icon: 'bridge',
    marker: [0, -0.6, 0.2],
    camera: [0.5, -2.6, -3.8],
    rotY: 0.55,
  },
];

export const heroStats = [
  { value: '86B', label: 'neurons' },
  { value: '100T', label: 'synapses' },
  { value: '1.4kg', label: 'of tissue' },
  { value: '20%', label: 'of your energy' },
];
