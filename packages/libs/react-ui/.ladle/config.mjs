/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: [
    'src/components/Button/Button.stories.tsx',
    'src/components/TrackerCard/TrackerCard.stories.tsx',
  ],
  addons: {
    a11y: {
      enabled: true,
    },
  },
};
