import os
from flask import Flask, jsonify, request, Response, url_for
from dummy_transformer import plot_spectrograms


app = Flask(__name__)
app.config["DEBUG"] = True

module_dir = os.path.abspath(os.path.dirname(__file__))


@app.route("/")
def hello_world():
    return "<p>Flask API: type http://127.0.0.1:5000/api/plot</p>"


@app.route("/api/plot")
def run_model():
    plot_spectrograms(path_to_save = 'static')
    html = f"<img src=\"{url_for('static', filename='input_waveform.jpg')}\">"
    html += f"<img src=\"{url_for('static', filename='input_spectrogram.jpg')}\">"
    html += f"<img src=\"{url_for('static', filename='output_spectrogram.jpg')}\">"
    html += f"<img src=\"{url_for('static', filename='output_waveform.jpg')}\">"
    return html
