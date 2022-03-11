#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[16];
    char unit[7];
    double number;
} dimension;

char unit_names[7][3] = {"m", "s", "mol", "A", "K", "cd", "kg"};

// data: string of colon seperated values 
dimension make_var(char* data) {
    dimension d;
    strcpy(d.name, strtok(data, ":"));
    for(int i = 0; i < 7; i++) {
        d.unit[i] = atof(strtok(NULL, ":"));
    }
    return d;
}

dimension* vars_from_file() {
    FILE* f = fopen("dimensions.txt", "r");
    if(f == NULL) {
        printf("error: no dimensions.txt file found");
        exit(2);
    }
    char* linebuf = malloc(256);

    dimension* dims = malloc(1<<16);
    for(int i = 0; fgets(linebuf, 256, f) != NULL; i++) {
        dims[i] = make_var(linebuf);
    }

    return dims;
}

// dimension* var_add(dimension* vars, dimension new) {
//     for(int i = 0; vars[i] == NULL; i++) {
//     }
// }