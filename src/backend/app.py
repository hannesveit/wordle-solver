from flask import Flask, request
from flask_cors import CORS

from solver import WordleSolver


app = Flask(__name__)
CORS(app)

cached_solvers = {}


def get_solver(n=5):
    if n not in cached_solvers:
        dict_file = "wordle_answers.txt" if n == 5 else "words.txt"
        cached_solvers[n] = WordleSolver(dict_file, n)
    return cached_solvers[n]


@app.route("/")
def suggestions():
    game_str = request.args.get("game", "", str)
    game = [move.split(":") for move in game_str.split(",")] if game_str else []
    n_suggestions = request.args.get("n_suggestions", 10, int)
    n = request.args.get("n", 5, int)

    solver = get_solver(n)
    solver.reset()

    for guess, response in game:
        solver.update_knowledge(guess, response)

    suggestions = solver.suggestions()

    return dict(
        valid_words_left=len(suggestions),
        n_suggestions=n_suggestions,
        suggestions=suggestions[:n_suggestions],
    )
