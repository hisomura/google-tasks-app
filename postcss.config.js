// https://nextjs.org/learn/basics/assets-metadata-css/styling-tips
// https://nextjs.org/docs/advanced-features/customizing-postcss-config#customizing-plugins
module.exports = {
  plugins: [
    "tailwindcss",
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
  ],
};
