#include <stdlib.h>
#include <stdio.h>
#include "dimension.h"
#include "map.h"
#include "parse.h"

void prompt(int preamble) {
	if(preamble) printf("conv v0.0.1c\n");
	printf(" > ");
	
	char* buffer = malloc(512);
	scanf("%s", buffer);
	if(buffer[512] != '\0') {
		printf("input buffer overflow\n");
		exit(2);
	}
	char** result = tokenize(buffer);
	for(int i = 0; result[i][0] != '\0'; i++) {
		printf("input %d: %s\n", i, result[i]);
	}
}

int main(int argc, char** argv) {
	dimension vars[2048];
	dimension onethousand;
	onethousand.number = 1000;
	vars[hs("one thousand")] = onethousand;
	printf("1000: %f\n", vars[hs("one thousand")].number);
	print_map(vars, sizeof(vars[0]), 2048);

	prompt(1);
	while(1) {
		prompt(0);
	}
}


// 1 * 2 + 3 / 2
// 2 + 1.5
// 3.5