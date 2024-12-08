from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")
@app.route("/")
def index():
    return send_from_directory("static", "index.html")
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory("static", filename)

def main(host='127.0.0.1', port=8080, debug=True):  # Provide default values for clarity
    app.run(host=host, port=port, debug=debug)

if __name__ == "__main__":
    main()  # Call main without arguments, as defaults are set