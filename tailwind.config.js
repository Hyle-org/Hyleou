/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#DF6445",    // Coral/Orange
                secondary: "#1E2933",  // Dark Blue/Navy
                neutral: "#516273",    // Gray/Slate
                black: "#000000",      // Pure Black
                white: "#FFFFFF",      // Pure White
            },
            fontFamily: {
                text: ["Inter", "sans-serif"],
                display: ["Montserrat", "sans-serif"],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
};
