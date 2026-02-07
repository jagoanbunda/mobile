module.exports = (request, options) => {
  if (request === 'expo-router') {
    return require.resolve('./__mocks__/expo-router.js');
  }
  return options.defaultResolver(request, options);
};
