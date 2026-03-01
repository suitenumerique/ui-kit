.PHONY: start stop build

IMAGE_NAME = ui-kit-storybook
CONTAINER_NAME = ui-kit-storybook

build:
	docker build -t $(IMAGE_NAME) .

start: build
	docker run --rm -p 6006:6006 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)
