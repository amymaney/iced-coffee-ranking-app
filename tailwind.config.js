module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
            'coffee-brown': '#6f4f37',
            'cream-beige': '#f5f5dc',
          },
        },
      },
    plugins: [require('@tailwindcss/typography')],
  };
  