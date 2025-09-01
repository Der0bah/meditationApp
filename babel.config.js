// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // add other plugins above if you use any
      "react-native-reanimated/plugin", // MUST be last
    ],
  };
};
