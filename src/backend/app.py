from flask import Flask, request
from flask_cors import CORS

from .solver import WordleSolver

app = Flask(__name__)
CORS(app)


@app.route("/")
def suggestions():
    n = request.args.get("n", 5, int)
    n_suggestions = request.args.get("n_suggestions", 10, int)
    game_str = request.args.get("game", "", str)
    game = [move.split(":") for move in game_str.split(",")] if game_str else []
    dict_file = "wordle_answers.txt" if n == 5 else "words.txt"
    solver = WordleSolver(dict_file, n)
    for guess, response in game:
        solver.update_knowledge(guess, response)
    all_suggestions = solver.suggestions()
    return dict(
        n_suggestions=n_suggestions,
        suggestions=all_suggestions[:n_suggestions],
        valid_words_left=len(all_suggestions)
    )
