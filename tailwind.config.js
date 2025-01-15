module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'upload-background': "url('/upload-bg.png')",
        'card-bg-1': "url('/images/bg-1.png')",
        'card-bg-2': "url('/images/bg-2.png')",
        'round-chain': "url('/images/round-chain.png')",
        'staking-1': "url('/images/staking-1.png')",
        'staking-2': "url('/images/staking-2.png')",
        'step1': "url('/images/step1.png')",
        'step2': "url('/images/step2.png')",
        'step3': "url('/images/step3.png')",
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      fontFamily: {
        odibee: ["Odibee Sans", "cursive"],
        Urbansit: ['Urbansit', 'sans-serif']
      },

      boxShadow: {
        'card': '0px 0px 10px 1px rgba(173, 26, 175, 0.25)'
      },
      screens: {
        'custom-xs': { 'min': '382px' },
        'custom-lg': { 'min': '1082px' },
        'custom-xl': { 'min': '1400px' },
      },
      backgroundImage: {
        "card": "url('/Card.png')"
      }
    },
    colors: {
        "main-bg": "#000C49",
        "bg-secondary": "#130B22",
        "bg-purple": '#0A0219',
        "main-blue": "#1845F3",
        "main-box": "#72727219",
        "cream": '#E9E1D0',
    },
  },
  plugins: [],
}