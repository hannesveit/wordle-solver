# wordle-solver

A [Wordle](https://www.nytimes.com/games/wordle/index.html) solver written in
Python and React, available [here](https://hannesveit.github.io/wordle-solver/).

![image](https://user-images.githubusercontent.com/5813121/152683792-ef682b3e-8725-4ea2-850b-d329849c6b0c.png)

The solver plays in hard mode (i.e., it always plays all green and yellow letters
obtained from previous guesses) and finds the solution in 3.67 guesses on average.
It uses a simple heuristic:

In each guess, it chooses the word whose "new" letters (those that haven't been
played yet) have the highest frequency in the remaining solution pool. Ties are
broken by taking positional letter frequency into account: it prefers words
containing those letters at positions where they often occur.

If you're looking for an optimal solution, there might be better options for you.
Plenty of Wordle solvers exist here on github, some of which brute-force an optimal
solution, and others which come closer to an optimal solution using more
sophisticated greedy heuristics that narrow down the solution pool more
efficiently. This one is fast, easy to use, and plays decently.

Note: Unlike some of the other solvers out there, this one supports the exact
coloring algorithm of the official Wordle app, which contradicts its own game
instructions (as of today). If you have multiple occurrences of the same letter
in your guess, and this letter is contained in the secret word *N* times, then
at most *N* occurrences of that letter in your guess will be yellow or green.
Any additional occurrences of that letter in your guess will come back as gray.

Example:

```
Secret:                       ENEMY
Guess:                        GEESE
Colors based on Wordle docs:  -yg-y
Actual Wordle colors:         -yg--
```

## Development

To run the app locally, docker and docker-compose are required.

```
cd /path/to/wordle-solver
docker-compose build
docker-compose up -d
```

Now, the app will be available at `http://localhost:3000`, and the backend
will be served at `http://localhost:8080`.

## Using the command line version

Python 3.8 or later is required. As an alternative, you can run the tool in
docker (see [below](#cli-via-docker)).

```
cd /path/to/wordle-solver/backend
python3 solver.py
```

```
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

### CLI via docker

If your python version is too old but you have docker, you can run
the command line version like this:

```
cd /path/to/wordle-solver
docker-compose build
docker-compose run backend solver
```

(Optional) command line args can be specified like this:
```
docker-compose run backend solver -n 8
```

(Optional) performance evaluation script can be run like this:
```
docker-compose run backend evaluation
```

## Performance

```
$ python3 evaluation.py
Using official Wordle answers as dictionary

Wordles with 5 letters
Need 3.67 guesses on average
Distribution: 1:1 | 2:133 | 3:911 | 4:945 | 5:256 | 6:58 | 7:8 | 8:3
Solved 2304/2315 Wordles (99.52%) in <= 6 guesses

Using larger dictionary

Wordles with 5 letters
Need 4.12 guesses on average
Distribution: 1:1 | 2:135 | 3:1242 | 4:1677 | 5:718 | 6:285 | 7:128 | 8:52 | 9:21 | 10:6 | 11:1 | 12:1
Solved 4058/4267 Wordles (95.10%) in <= 6 guesses

Wordles with 6 letters
Need 3.57 guesses on average
Distribution: 1:1 | 2:423 | 3:3283 | 4:2368 | 5:625 | 6:171 | 7:48 | 8:12 | 9:5
Solved 6871/6936 Wordles (99.06%) in <= 6 guesses

Wordles with 7 letters
Need 3.29 guesses on average
Distribution: 1:1 | 2:1004 | 3:5372 | 4:2240 | 5:427 | 6:117 | 7:28 | 8:9 | 9:4 | 10:1
Solved 9161/9203 Wordles (99.54%) in <= 6 guesses

Wordles with 8 letters
Need 2.97 guesses on average
Distribution: 1:1 | 2:1879 | 3:6096 | 4:1275 | 5:124 | 6:18 | 7:3
Solved 9393/9396 Wordles (99.97%) in <= 6 guesses

Wordles with 9 letters
Need 2.72 guesses on average
Distribution: 1:1 | 2:2699 | 3:4483 | 4:495 | 5:17 | 6:1
Solved 7696/7696 Wordles (100.00%) in <= 6 guesses

Wordles with 10 letters
Need 2.55 guesses on average
Distribution: 1:1 | 2:3071 | 3:3119 | 4:184 | 5:2
Solved 6377/6377 Wordles (100.00%) in <= 6 guesses

Wordles with 11 letters
Need 2.35 guesses on average
Distribution: 1:1 | 2:2984 | 3:1527 | 4:44 | 5:1
Solved 4557/4557 Wordles (100.00%) in <= 6 guesses

Wordles with 12 letters
Need 2.26 guesses on average
Distribution: 1:1 | 2:2318 | 3:770 | 4:12
Solved 3101/3101 Wordles (100.00%) in <= 6 guesses

Wordles with 13 letters
Need 2.21 guesses on average
Distribution: 1:1 | 2:1494 | 3:381 | 4:4
Solved 1880/1880 Wordles (100.00%) in <= 6 guesses
```
