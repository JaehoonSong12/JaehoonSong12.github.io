from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")
@app.route("/")
def index():
    return send_from_directory("static", "index.html")
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory("static", filename)
def main():
    app.run(port=8080)
if __name__ == "__main__":
    main()