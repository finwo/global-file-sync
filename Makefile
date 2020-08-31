all: README.md

README.md:
	tool/template.sh -c config.ini -p partial partial/README.md.head > README.md
	find doc -mindepth 1 -maxdepth 1 -type d | sort | xargs -n 1 tool/build-readme-item.sh partial/README.md.item README.md
	tool/template.sh -c config.ini -p partial partial/README.md.tail >> README.md

.PHONY: clean
clean:
	rm README.md
