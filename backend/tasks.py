import os

from invoke import task


@task
def solver(c, n=5, d="wordle_answers.txt", s=10):
    """Run the command line version of the solver."""
    c.run(f"python3 solver.py -n {n} -s {s} -d {d}")


@task
def evaluation(c):
    """Run the evaluation script."""
    c.run(f"python3 evaluation.py")


@task
def serve(c):
    """Start the flask backend."""
    port = os.environ.get("PORT", "8080")
    c.run(f"gunicorn --bind :{port} --workers 1 --threads 8 --timeout 0 app:app")
