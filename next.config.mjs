/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/programlar",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
