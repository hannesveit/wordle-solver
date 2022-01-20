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
        self.valid_words = list(self.all_words)
        self.green, self.yellow, self.gray = {}, {}, set()

    def valid(self, word):
        return (
            all(word[i] == l for (i, l) in self.green.items())
            and all(l not in word for l in self.gray)
            and all(
                any(word[i] == l for i in positions)
                for l, positions in self.yellow.items()
            )
        )

    def update_knowledge(self, guess, response):
        for i, (gi, ri) in enumerate(zip(guess, response)):
            if ri == "-":
                self.gray.add(gi)
            elif ri == "g":
                self.green[i] = gi
            elif ri == "y":
                self.yellow[gi] = self.yellow.get(gi, set(range(self.n))) - {i}
            else:
                raise ValueError(f'Response contains invalid symbol "{ri}"')

        self.valid_words = [
            w for w in self.valid_words if self.valid(w) and w != guess
        ]


    def guess(self):
        return self.suggestions()[0] if self.valid_words else None


    def suggestions(self):
        num_words_containing_letter = Counter(
            chain(*(set(w) for w in self.valid_words))
        )

        pos_letter_count = {
            i: Counter(w[i] for w in self.valid_words)
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

        return list(reversed(sorted(self.valid_words, key=key)))


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
    n_sugg = args["suggestions"]

    print('Example: secret = "PUFFY", guess = "FUNNY" --> enter colors "yg--g"')
    solver = WordleSolver(dict_file, n)
    solution = None

    while (suggestions := solver.suggestions()):
        print(f"\nSuggestions: {', '.join(suggestions[:n_sugg])}")
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

