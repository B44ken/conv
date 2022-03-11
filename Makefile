build:
	gcc src/*.c -o conv

clean:
	rm conv

run: build
	./conv
