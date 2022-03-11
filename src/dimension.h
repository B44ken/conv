typedef struct {
    char name[16];
    char unit[7];
    double number;
} dimension;

dimension make_dimension(char* data);
dimension* dimension_from_file();