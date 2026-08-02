export interface BrainSection {
  id: string;
  lobe: string;
  name: string;
  description: string;
  functions: string[];
  icon: string;
  percentage: string;
}

export const brainSections: BrainSection[] = [
  {
    id: 'frontal',
    lobe: 'Frontal Lobe',
    name: 'Frontal Lobe',
    description: 'The command center of the brain, responsible for executive functions, decision-making, and personality. It\'s what makes you uniquely you.',
    functions: [
      'Executive function & planning',
      'Decision making & judgment',
      'Personality & social behavior',
      'Motor control & voluntary movement',
      'Speech production (Broca\'s area)',
      'Working memory & attention',
      'Emotional regulation',
      'Problem solving & reasoning',
    ],
    icon: '🧠',
    percentage: '41%',
  },
  {
    id: 'parietal',
    lobe: 'Parietal Lobe',
    name: 'Parietal Lobe',
    description: 'The brain\'s sensory integration hub, processing touch, temperature, pain, and spatial awareness. It tells you where your body is in space.',
    functions: [
      'Somatosensory processing',
      'Spatial orientation & navigation',
      'Body awareness (proprioception)',
      'Touch, pressure, temperature',
      'Pain perception',
      'Mathematical reasoning',
      'Language comprehension',
      'Object manipulation',
    ],
    icon: '🎯',
    percentage: '19%',
  },
  {
    id: 'temporal',
    lobe: 'Temporal Lobe',
    name: 'Temporal Lobe',
    description: 'The memory and auditory center, crucial for hearing, language comprehension, and forming long-term memories. Your life story lives here.',
    functions: [
      'Auditory processing',
      'Memory formation (hippocampus)',
      'Language comprehension (Wernicke\'s)',
      'Visual memory & recognition',
      'Emotional association',
      'Face recognition',
      'Sound localization',
      'Semantic memory',
    ],
    icon: '👂',
    percentage: '22%',
  },
  {
    id: 'occipital',
    lobe: 'Occipital Lobe',
    name: 'Occipital Lobe',
    description: 'The visual processing powerhouse, receiving and interpreting everything you see. It turns light into meaning.',
    functions: [
      'Visual processing & perception',
      'Color recognition',
      'Motion detection',
      'Depth perception',
      'Pattern recognition',
      'Reading & word recognition',
      'Visual memory',
      'Spatial frequency analysis',
    ],
    icon: '👁️',
    percentage: '18%',
  },
  {
    id: 'cerebellum',
    lobe: 'Cerebellum',
    name: 'Cerebellum',
    description: 'The "little brain" that coordinates movement, balance, and motor learning. It fine-tunes every physical action you take.',
    functions: [
      'Balance & posture',
      'Motor coordination',
      'Precision & timing',
      'Motor learning & adaptation',
      'Eye movement control',
      'Speech articulation',
      'Cognitive functions',
      'Emotional regulation',
    ],
    icon: '⚖️',
    percentage: '10%',
  },
  {
    id: 'brainstem',
    lobe: 'Brainstem',
    name: 'Brainstem',
    description: 'The vital life-support system, controlling breathing, heart rate, and consciousness. It connects the brain to the spinal cord.',
    functions: [
      'Breathing & respiratory control',
      'Heart rate & blood pressure',
      'Consciousness & arousal',
      'Sleep-wake cycles',
      'Swallowing & gag reflex',
      'Cranial nerve nuclei',
      'Autonomic functions',
      'Relay station for signals',
    ],
    icon: '🫀',
    percentage: '2%',
  },
];