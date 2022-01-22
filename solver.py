from argparse import ArgumentParser
from collections import Counter
from itertools import chain


class WordleSolver:
    def __init__(self, dict_file, n=5):
        with open(dict_file) as fh:
            self.all_words = [
                w for w in (l.strip().upper() for l in fh.readlines())
                if len(w) == n
            ]
        self.n = n
        self.reset()

    def reset(self):
        self.remaining_words = list(self.all_words)
        self.green, self.yellow, self.gray = {}, {}, set()

    def update_knowledge(self, guess, response):
        for i, (gi, ri) in enumerate(zip(guess, response)):
            if ri == "-":
                self.update_gray(gi)
            elif ri == "g":
                self.update_green(i, gi)
            elif ri == "y":
                self.update_yellow(gi, i)
            else:
                raise ValueError(f'Response contains invalid symbol "{ri}"')

        self.remaining_words = [
            w for w in self.remaining_words if self.valid(w) and w != guess
        ]

    def update_gray(self, letter):
        self.gray.add(letter)

    def update_green(self, position, letter):
        self.green[position] = letter
        if letter in self.yellow:
            self.update_yellow(letter, position, True)

    def update_yellow(self, letter, wrong_pos, standby=False):
        # This "standby" feature (plus the annoying additional complexity in
        # handling gray and yellow letters in the valid() method below and in
        # the response generation in evaluation.py) became necessary to support
        # Wordle's unexpected coloring behavior with repeated letters:
        #
        # If we have a green letter, and our guess contains the same letter again
        # (at another position), then this letter will be gray unless there are
        # one or more *additional* occurrences of the same letter in the word, in
        # which case it will be yellow.
        #
        # This behavior isn't mentioned in the Wordle instructions (as of today).
        # In fact, it contradicts them. The quickstart guide states: yellow means
        # that the letter is in the secret word but not in this position, and
        # gray means that the letter is not contained in the word at all. Period.
        # According to this, any repeat of a green letter should be yellow no
        # matter what, and any gray letter should not be in the word, no matter
        # what. Alas, the game behaves differently.
        #
        # Re "standby": once a letter turns green, we put our "yellow knowledge"
        # for this letter on "standby", i.e., it won't be enforced as a constraint
        # in the valid() method anymore (since we don't know if the word contains
        # another occurence until we try it again and get a yellow or gray reponse
        # for it). However, we don't want to delete this knowledge yet, in case we
        # find out later that there is in fact another occurrence of the letter in
        # the word, in which case we can still exclude all the yellow positions we
        # have learned about so far (including the one that just turned green). As
        # soon as we get another yellow response for the letter, its previously
        # obtained "yellow knowledge" will be restored from standby mode.
        y = self.yellow[letter] = self.yellow.get(letter, dict(excluded=set()))
        y["excluded"] |= {wrong_pos}
        y["standby"] = standby

    def valid(self, word):
        return (
            all(word[i] == l for i, l in self.green.items())
            and all(
                wi not in self.gray
                for i, wi in enumerate(word) if i not in self.green
            )
            and all(
                any(
                    wi == l for i, wi in enumerate(word)
                    if i not in y["excluded"] and i not in self.green
                )
                for l, y in self.yellow.items() if not y["standby"]
            )
        )

    def guess(self):
        return self.suggestions()[0] if self.remaining_words else None

    def suggestions(self):
        num_words_containing_letter = Counter(
            chain(*(set(w) for w in self.remaining_words))
        )
        pos_letter_count = {
            i: Counter(w[i] for w in self.remaining_words)
            for i in range(self.n)
        }
        known_letters = set(chain(self.green.values(), self.yellow.keys()))

        def key(word):
            new_letters = set(word) - known_letters
            letter_score = sum(num_words_containing_letter[l] for l in new_letters)
            scored_positions = (i for i, l in enumerate(word) if l in new_letters)
            letter_pos_score = sum(
                pos_letter_count[i][word[i]] for i in scored_positions
            )
            return letter_score, letter_pos_score

        return list(reversed(sorted(self.remaining_words, key=key)))


if __name__ == "__main__":
    parser = ArgumentParser(description="A simple Wordle solver.")
    parser.add_argument("-n", "--len", help="wordle length", type=int, default=5)
    parser.add_argument("-d", "--dict", help="dictionary file", required=False)
    parser.add_argument(
        "-s", "--sugg", help="number of suggestions", type=int, default=10
    )
    args = vars(parser.parse_args())
    n = args["len"]
    dict_file = args["dict"] or "wordle_answers.txt" if n == 5 else "words.txt"
    n_sugg = args["sugg"]

    print('Example: secret = "PUFFY", guess = "FUNNY" --> enter colors "yg--g"')
    solver = WordleSolver(dict_file, n)
    solution = None

    while (suggestions := solver.suggestions()):
        print(f"\n{len(suggestions)} possible solutions left.")
        print(f"Suggestions: {', '.join(suggestions[:n_sugg])}")
        guess = input(
            f'Your guess (leave blank to choose "{suggestions[0]}"): '
        ).upper() or suggestions[0]
        if len(guess) != n or not guess.isalpha():
            print(f"Guess must have length {n} and contain only letters")
            continue
        while (response := input(f'Enter colors for "{guess}": ').lower()):
            if len(response) == n and all(l in "yg-" for l in response):
                break
            print(f"Response must have length {n} and and contain only g/y/-")
        if response == n * "g":
            solution = guess
            break
        solver.update_knowledge(guess, response)

    print(f"\nYay! {solution}!\n" if solution else "\nNo valid words left :(\n")
