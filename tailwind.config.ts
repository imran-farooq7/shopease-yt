import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			container: {
				padding: "3rem",
			},
			gridTemplateColumns: {
				fluid: "repeat(auto-fit,minmax(15rem,1fr))",
			},
		},
	},
	plugins: [],
};
export default config;
