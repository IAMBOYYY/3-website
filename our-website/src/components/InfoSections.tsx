import { motion } from 'framer-motion';
import { brainSections } from '../data/brainData';

interface InfoSectionsProps {
  scrollProgress: number;
}

export const InfoSections = ({ scrollProgress }: InfoSectionsProps) => {
  return (
    <div className="content-container">
      <div className="max-w-4xl mx-auto space-y-20 pb-64">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent-500 to-purple-700 bg-clip-text text-transparent mb-6">
            The Human Brain
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore the most complex structure in the known universe. 
            Scroll to journey through each region and discover how it shapes who you are.
          </p>
        </motion.section>

        {brainSections.map((section, index) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="scroll-section relative"
            style={{ 
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
            } as React.CSSProperties}
          >
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                  <span className="inline-block px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full text-sm font-medium mb-4">
                    {section.lobe}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    {section.name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {section.description}
                  </p>
                  <div className="space-y-3">
                    {section.functions.map((func, i) => (
                      <motion.div
                        key={func}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-200">{func}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="relative aspect-square max-w-md mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                    <div className="relative p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700 shadow-2xl">
                      <div className="text-center">
                        <div className="text-6xl md:text-8xl mb-4">{section.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {section.percentage} of brain volume
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            <div 
              className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-400"
              style={{ opacity: scrollProgress > 0.95 ? 0 : 1 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.section>
        ))}

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 text-center border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Data sourced from neuroscience research and medical literature
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Built with React Three Fiber, GSAP, and Framer Motion
          </p>
        </motion.footer>
      </div>
    </div>
  );
};