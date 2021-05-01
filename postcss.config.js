const tailwindcss = require('tailwindcss');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const plugins = [tailwindcss];
if (!IS_DEVELOPMENT) {
  const purgecss = require('@fullhuman/postcss-purgecss');
  plugins.push(
    purgecss({
      content: ['src/*.html'],
      defaultExtractor: (content) => content.match(/[\w-:/]+(?<!:)/g) || [],
    })
  );
}

module.exports = { plugins };
