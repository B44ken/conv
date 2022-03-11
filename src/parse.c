#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

// 'a'lphabet, 'd'igit, 'o'perator
char token_type(char token) {
    if(isalpha(token)) return 'a';
    if(isdigit(token) || token == '.') return 'd';
    if(token == ' ') return ' ';
    char* ops = "+-*/^=()";
    for(int i = 0; ops[i] != '\0'; i++)
        if(token == ops[i]) return 'o';
    return 255;
}

char** tokenize(char* string) {
    char** words = malloc(512);
    int word_count = -1;
    int word_len = 0;
    char last_type = 0;
    for(int i = 0; i < strlen(string); i++) {
        char type = token_type(string[i]);

        if(type == ' ') {
            // word_len = 0;
            // words[word_count] = malloc(64);
        }
        else if(last_type != type || type == 'o') {
            word_len = 0;
            word_count++;
            words[word_count] = malloc(64);
            words[word_count][0] = string[i];
            word_len++;
        }
        else if(last_type == type) {
            words[word_count][word_len] = string[i];
            word_len++;
        }
        last_type = type;
    }
    words[word_count+1] = "\0";
    return words;
}

char word_type(char* word) {
    return token_type(word[0]);
}

char factors() {

}

/*
*/