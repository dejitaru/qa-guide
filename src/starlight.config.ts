import { defineConfig } from '@astrojs/starlight/config';

export default defineConfig({
  components: {
    PageFrame: './src/components/KeyboardNavigation.astro'
  }
});