#!/bin/sh

for x in 0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z other pos punctuation
do
    wget "http://storage.googleapis.com/books/ngrams/books/googlebooks-eng-all-1gram-20120701-$x.gz"
done
