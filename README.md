# wordle-solver

A simple [Wordle](https://www.powerlanguage.co.uk/wordle/) solver written in python.

The solver plays in hard mode (i.e., it always plays all green and yellow letters
obtained from previous guesses) and finds the solution in 3.7 guesses on average.
It uses a simple heuristic:

In each guess, it chooses the word whose "new" letters (those that haven't been
played yet) have the highest frequency in the remaining solution pool. Ties are
broken by taking positional letter frequency into account: it prefers words
containing those letters at positions where they often occur.

If you're looking for an optimal solution, this one is not for you. There are
plenty of Wordle solvers here on github, some of which brute-force an optimal
solution, and others which come closer to an optimal solution using more
sophisticated greedy heuristics that narrow down the solution pool more
efficiently. This one is fast and was fun to implement.

## Usage

Python 3.8 or later is required.

```
$ python3 solver.py
Example: secret = "PUFFY", guess = "FUNNY" --> enter colors "yg--g"

2315 possible solutions left.
Suggestions: LATER, ALTER, ALERT, IRATE, AROSE, STARE, RAISE, ARISE, LEARN, RENAL
Your guess (leave blank to choose "LATER"):
Enter colors for "LATER": --y-y

63 possible solutions left.
Suggestions: TORUS, SHORT, FROST, SNORT, SPORT, STORY, SHIRT, TURBO, STORK, STORM
Your guess (leave blank to choose "TORUS"):
Enter colors for "TORUS": ygy--

1 possible solutions left.
Suggestions: ROBOT
Your guess (leave blank to choose "ROBOT"):
Enter colors for "ROBOT": ggggg

Yay! ROBOT!
```
![image](https://user-images.githubusercontent.com/5813121/150350490-0abb57c7-eec1-40e0-ac09-02c11661987f.png)


In each round, you can accept the top suggestion by hitting enter, or enter your own
guess instead if you don't like the top suggestion. Then enter the colors that Wordle
gives you for this guess.

You can also play with word lengths other than 5, use custom dictionaries, and adjust
the number of suggestions displayed in each round:

```
$ python3 solver.py -h
usage: solver.py [-h] [-n LEN] [-d DICT] [-s SUGG]

A simple Wordle solver.

options:
  -h, --help            show this help message and exit
  -n LEN, --len LEN     wordle length
  -d DICT, --dict DICT  dictionary file
  -s SUGG, --sugg SUGG  number of suggestions
```

### Using docker

If your python version is too old but you have docker:

```
cd /path/to/wordle-solver
docker build -t wordle-solver .
docker run -it --rm wordle-solver
```

## Performance

```
$ python3 evaluation.py
Using official Wordle answers as dictionary

Wordles with 5 letters
Need 3.70 guesses on average
Distribution: 1:1 | 2:133 | 3:885 | 4:942 | 5:275 | 6:67 | 7:9 | 8:3
Solved 2303/2315 Wordles (99.48%) in <= 6 guesses

Using larger dictionary

Wordles with 5 letters
Need 4.16 guesses on average
Distribution: 1:1 | 2:134 | 3:1206 | 4:1644 | 5:768 | 6:299 | 7:128 | 8:56 | 9:22 | 10:6 | 11:1 | 12:1 | 13:1
Solved 4052/4267 Wordles (94.96%) in <= 6 guesses

Wordles with 6 letters
Need 3.62 guesses on average
Distribution: 1:1 | 2:422 | 3:3169 | 4:2356 | 5:708 | 6:206 | 7:55 | 8:13 | 9:6
Solved 6862/6936 Wordles (98.93%) in <= 6 guesses

Wordles with 7 letters
Need 3.35 guesses on average
Distribution: 1:1 | 2:958 | 3:5098 | 4:2421 | 5:521 | 6:140 | 7:44 | 8:15 | 9:4 | 10:1
Solved 9139/9203 Wordles (99.30%) in <= 6 guesses

Wordles with 8 letters
Need 3.03 guesses on average
Distribution: 1:1 | 2:1762 | 3:5847 | 4:1564 | 5:186 | 6:28 | 7:5 | 8:3
Solved 9388/9396 Wordles (99.91%) in <= 6 guesses

Wordles with 9 letters
Need 2.79 guesses on average
Distribution: 1:1 | 2:2481 | 3:4425 | 4:728 | 5:59 | 6:2
Solved 7696/7696 Wordles (100.00%) in <= 6 guesses

Wordles with 10 letters
Need 2.61 guesses on average
Distribution: 1:1 | 2:2844 | 3:3166 | 4:344 | 5:22
Solved 6377/6377 Wordles (100.00%) in <= 6 guesses

Wordles with 11 letters
Need 2.42 guesses on average
Distribution: 1:1 | 2:2765 | 3:1667 | 4:119 | 5:5
Solved 4557/4557 Wordles (100.00%) in <= 6 guesses

Wordles with 12 letters
Need 2.37 guesses on average
Distribution: 1:1 | 2:2022 | 3:1000 | 4:77 | 5:1
Solved 3101/3101 Wordles (100.00%) in <= 6 guesses

Wordles with 13 letters
Need 2.32 guesses on average
Distribution: 1:1 | 2:1322 | 3:514 | 4:42 | 5:1
Solved 1880/1880 Wordles (100.00%) in <= 6 guesses
```
