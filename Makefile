all: README.md

README.md:
	cat README.md.head > README.md
	find doc -mindepth 1 -maxdepth 1 -type d | sort | xargs -n 1 tool/build-readme-item.sh README.md.item README.md
	cat README.md.tail >> README.md

.PHONY: clean
clean:
	rm README.md
