from collections import defaultdict
from itertools import chain

from solver import WordleSolver


def response(word, guess):
    green_positions = [i for i, (gi, wi) in enumerate(zip(guess, word)) if gi == wi]
    word_minus_green = [l for i, l in enumerate(word) if i not in green_positions]
    yellow_positions = [
        i for i, (gi, wi) in enumerate(zip(guess, word))
        if gi in word_minus_green and gi != wi
    ]
    response = ["-" for _ in word]
    for i in green_positions:
        response[i] = "g"
    for i in yellow_positions:
        response[i] = "y"
    return "".join(response)


def simulate(dict_file, n_range):
    max_guesses = 6
    with open(dict_file) as fh:
        all_words = [w for w in (l.strip().upper() for l in fh.readlines())]
    for n in n_range:
        words_n = [w for w in all_words if len(w) == n]
        solver = WordleSolver(dict_file, n)
        distribution = defaultdict(int)
        for word in words_n:
            solver.reset()
            num_guesses = 0
            while (guess := solver.guess()):
                num_guesses += 1
                resp = response(word, guess)
                if resp == n * "g":
                    break
                solver.update_knowledge(guess, resp)
            assert guess == word
            distribution[num_guesses] += 1
        avg_guesses = sum(k * v for k, v in distribution.items()) / len(words_n)
        num_won = sum(v for k, v in distribution.items() if k <= max_guesses)
        win_percentage = 100 * num_won / len(words_n)
        dist_str = " | ".join(f"{j}:{k}" for j, k in sorted(distribution.items()))
        print(f"Wordles with {n} letters")
        print(f"Need {avg_guesses:.2f} guesses on average")
        print(f"Distribution: {dist_str}")
        print(
            f"Solved {num_won}/{len(words_n)} Wordles "
            f"({win_percentage:.2f}%) in <= {max_guesses} guesses\n"
        )


print("Using official Wordle answers as dictionary\n")
simulate("wordle_answers.txt", [5])
print("Using larger dictionary\n")
simulate("words.txt", range(5, 14))
