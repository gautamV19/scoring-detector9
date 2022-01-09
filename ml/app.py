from flask import Flask, request,jsonify, redirect

import mtx as m

app = Flask(__name__)

app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.gif']
app.config['UPLOAD_PATH'] = './public'

@app.route('/')
def index():
    return jsonify(
        username="g.user.username",
        email="g.user.email",
        id="g.user.id"
    )

@app.route('/ml', methods=['POST'])
def index_ml():
    path = request.args.get("path")
    print("**** our path",path)
    result = m.prediction(path)
    probs= m.prediction_graph(path)
    return jsonify(isScoring=result ,result=probs)

if __name__ == '__main__':
    app.run(debug=True)