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


In each round, you can accept the guessed word by hitting enter, or enter your own
guess instead if you don't like the top suggestion. Then enter the colors that Wordle
gave you for this guess.

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
Distribution: 1:1 | 2:133 | 3:885 | 4:942 | 5:275 | 6:66 | 7:9 | 8:3 | 9:1
Solved 2302/2315 Wordles (99.44%) in <= 6 guesses

Using larger dictionary

Wordles with 5 letters
Need 4.16 guesses on average
Distribution: 1:1 | 2:134 | 3:1206 | 4:1641 | 5:763 | 6:301 | 7:127 | 8:59 | 9:26 | 10:6 | 11:1 | 12:1 | 13:1
Solved 4046/4267 Wordles (94.82%) in <= 6 guesses

Wordles with 6 letters
Need 3.63 guesses on average
Distribution: 1:1 | 2:422 | 3:3168 | 4:2340 | 5:704 | 6:215 | 7:63 | 8:14 | 9:8 | 10:1
Solved 6850/6936 Wordles (98.76%) in <= 6 guesses

Wordles with 7 letters
Need 3.36 guesses on average
Distribution: 1:1 | 2:958 | 3:5066 | 4:2427 | 5:536 | 6:139 | 7:51 | 8:20 | 9:4 | 10:1
Solved 9127/9203 Wordles (99.17%) in <= 6 guesses

Wordles with 8 letters
Need 3.04 guesses on average
Distribution: 1:1 | 2:1762 | 3:5819 | 4:1562 | 5:210 | 6:31 | 7:7 | 8:4
Solved 9385/9396 Wordles (99.88%) in <= 6 guesses

Wordles with 9 letters
Need 2.80 guesses on average
Distribution: 1:1 | 2:2481 | 3:4378 | 4:762 | 5:67 | 6:6 | 7:1
Solved 7695/7696 Wordles (99.99%) in <= 6 guesses

Wordles with 10 letters
Need 2.62 guesses on average
Distribution: 1:1 | 2:2844 | 3:3126 | 4:381 | 5:22 | 6:3
Solved 6377/6377 Wordles (100.00%) in <= 6 guesses

Wordles with 11 letters
Need 2.43 guesses on average
Distribution: 1:1 | 2:2765 | 3:1638 | 4:144 | 5:7 | 6:2
Solved 4557/4557 Wordles (100.00%) in <= 6 guesses

Wordles with 12 letters
Need 2.38 guesses on average
Distribution: 1:1 | 2:2009 | 3:998 | 4:90 | 5:3
Solved 3101/3101 Wordles (100.00%) in <= 6 guesses

Wordles with 13 letters
Need 2.32 guesses on average
Distribution: 1:1 | 2:1318 | 3:513 | 4:46 | 5:2
Solved 1880/1880 Wordles (100.00%) in <= 6 guesses
```
