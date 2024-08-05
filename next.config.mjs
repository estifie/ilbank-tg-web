/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/programlar",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
