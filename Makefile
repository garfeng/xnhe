all:
	rm build/* -rf
	webpack
	cp public/package.json build/

test:
	npm run start
