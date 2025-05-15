// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	transitions: true,
	integrations: [
		starlight({
			title: 'QA Guide',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/dejitaru/qa-guide' }],
			sidebar: [
				{
					label: 'Introduction',
					items: [
						{ label: 'Explore guide', slug: 'guides/qa-guide' },
						{ label: 'What is it software testing?', slug: 'guides/q7' },
						{ label: 'Why do we need to test software', slug: 'guides/q8' },
						{ label: 'What is the difference between test scenarios, test cases, and test script?', slug: 'guides/q9' }
					],
				},               
				{
					label: 'SDLC, STLC, and Agile Processes',
					autogenerate: { directory: 'sdlc' },
				},
				{
					label: 'Types of testing',
					autogenerate: { directory: 'types-of-testing' },
				},
				{
					label: 'Test design and execution',
					autogenerate: { directory: 'test-design-and-execution' },
				},
				{
					label: 'Defects and bug reporting',
					autogenerate: { directory: 'defects-and-bug-reporting' },
				},
				{
					label: 'Test Documentation',
					autogenerate: { directory: 'test-documentation' },
				},
				{
					label: 'Testing Strategies and Best Practices',
					autogenerate: { directory: 'testing-strategies-and-best-practices' },
				},
				{
					label: 'API testing',
					autogenerate: { directory: 'api-testing' },
				},
				{
					label: 'Practice',
					autogenerate: { directory: 'practice' },
				}
			],
			head: [
				{
					tag: 'script',
					attrs: {
						src: '/keyboard-nav.js',
						type: 'module'
					}
				}
			]
		}),
	],
	vite: {
		publicDir: 'public'
	}
});
