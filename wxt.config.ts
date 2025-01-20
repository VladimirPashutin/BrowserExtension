import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'BusinessArtificialIntelligence',
    description: 'Расширение для генерации ответов на отзывы и продвижения бизнеса с помощью искусственного интеллекта',
    permissions: ['storage', 'tabs']
  }
});
