#include <stdio.h>
#include "dimension.h"


// not cryptographic because i don't care
int hash_mod(char* string, int size) {
    int sum = 0;
    for(int i = 0; string[i] != '\0'; i++) {
        sum += (i+1) * (i+1) * string[i] * string[i];
    }
    return sum % size;
}

// compact table[h("key")] = value notation
int h(char* string) {
    return hash_mod(string, 1024);
}

void print_map(void* map, int entry_size, int size) {
    printf("map takes up %d entries of %db (%fkb)\n", size, entry_size, (float)entry_size * (float)size / 1024);
}