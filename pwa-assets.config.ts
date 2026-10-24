import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

// Generates the PNG/ICO icons from public/icon.svg. Run `npm run generate-icons`
// after changing the source icon, then commit the generated files in public/.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: minimal2023Preset,
  images: ['public/icon.svg'],
});
