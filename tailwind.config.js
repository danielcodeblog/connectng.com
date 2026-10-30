module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Visore', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Visore', 'Plus Jakarta Sans', 'sans-serif'],
        visore: ['Visore', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        // Force hex colors to avoid oklab/oklch
        // This is a workaround for framer-motion animation issues
      },
    },
  },
};
