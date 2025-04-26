from flask import Flask, jsonify, request
from flask_cors import CORS
from model import predict_sentiment

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type"])

results = [False,False]
data = {"face": False, "nlp": False}

@app.route('/')
def index():
    return jsonify({"message": "pong"})

@app.route('/results')
def res():
    print(data)
    return jsonify({"results": data})

@app.route('/face', methods=['POST'])
def face():
    d = request.get_json()
    if d['sentiment']:
        results[0] = True
        data["face"] = d['sentiment']
    return jsonify({"message": "pong"})

@app.route('/reset', methods=['POST'])
def reset():
    results = [False,False]
    data = {"face": False, "nlp": False}
    return jsonify({"message": "reset"})

@app.route('/list', methods=['POST'])
def receive_list():
    d = request.get_json()
    print("Received list:", d.get('list'))
    out = predict_sentiment(d.get('list'))
    sum = 0
    for i in out:
        sum += i
    avg = sum/len(out)
    data["nlp"] = avg
    results[1] = True
    return jsonify({"results": avg})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)