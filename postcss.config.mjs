const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {})
  },
};

export default config;
