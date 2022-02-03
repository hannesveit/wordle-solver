import string

from flask import Flask, request
from flask_cors import CORS

from solver import WordleSolver


app = Flask(__name__)
CORS(app)


@app.route("/")
def suggestions():
    n_suggestions = request.args.get("n_suggestions", 10, int)
    n = request.args.get("n", 5, int)
    dict_file = "wordle_answers.txt" if n == 5 else "words.txt"
    game_str = request.args.get("game", "", str)
    game = [move.split(":") for move in game_str.split(",")] if game_str else []

    if any(len(x) != 2 for x in game):
        return "Invalid game (format: guess1:response1,guess2:response2,...)", 400

    solver = WordleSolver(dict_file, n)

    for guess, response in game:
        if any(l not in string.ascii_uppercase for l in guess) or len(guess) != n:
            return (
                f"Guesses need to be length {n} and contain only uppercase letters.",
                400,
            )
        if any(l not in "gy-" for l in response) or len(response) != n:
            return f"Responses need to be length {n} and contain only g/y/-.", 400
        solver.update_knowledge(guess, response)

    suggestions = solver.suggestions()

    return dict(
        valid_words_left=len(suggestions),
        suggestions=suggestions[:n_suggestions],
    )
