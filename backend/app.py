from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
db = client["cyber_security"]
scans = db["scan_history"]
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "Cyber Security Backend is running!"
    })

@app.route("/scan")
def scan():
    from datetime import datetime

    scan_data = {
        "status": "Secure",
        "threats": 0,
        "message": "No threats detected",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    scans.insert_one(scan_data)

    return jsonify(scan_data)
@app.route("/db-test")
def db_test():
    try:
        client.admin.command("ping")
        return jsonify({
            "status": "success",
            "message": "MongoDB connected successfully!"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/history")
def history():
    records = list(
        scans.find({}, {"_id": 0}).sort("time", -1)
    )
    return jsonify(records)
if __name__ == "__main__":
    app.run(debug=True, port=5000)