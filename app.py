# app.py
import os
import re
import time
from typing import List, Dict

from flask import Flask, request, jsonify, send_from_directory, make_response
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch

MODEL_NAME = "microsoft/DialoGPT-small"
PORT = 5000
HOST = "127.0.0.1"

MAX_NEW_TOKENS = 150
MAX_HISTORY_TURNS = 6

app = Flask(__name__, static_folder='.')

device = 0 if torch.cuda.is_available() else -1
print(f"[{time.strftime('%H:%M:%S')}] Loading {MODEL_NAME} on {'GPU' if device==0 else 'CPU'}...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to("cuda" if device == 0 else "cpu")

print(f"[{time.strftime('%H:%M:%S')}] Model ready.")

chat_histories: Dict[str, List[int]] = {}  # store tokenized history


def json_response(payload: dict, status: int = 200):
    resp = make_response(jsonify(payload), status)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/samanthaChat.html")
def chat_page():
    return send_from_directory(".", "samanthaChat.html")


@app.route("/api/chat", methods=["POST"])
def chat_api():
    try:
        data = request.get_json(force=True, silent=True) or {}
        user_message = (data.get("prompt") or "").strip()
        if not user_message:
            return json_response({"response": "Empty message."}, status=400)

        session_id = request.cookies.get("session_id") or "default"
        history_ids = chat_histories.get(session_id)

        # encode new user input
        new_input_ids = tokenizer.encode(user_message + tokenizer.eos_token, return_tensors="pt")
        new_input_ids = new_input_ids.to(model.device)

        if history_ids is not None:
            bot_input_ids = torch.cat([history_ids, new_input_ids], dim=-1)
        else:
            bot_input_ids = new_input_ids

        output_ids = model.generate(
            bot_input_ids,
            max_new_tokens=MAX_NEW_TOKENS,
            pad_token_id=tokenizer.eos_token_id,
        )

        # only decode the new part (skip the input)
        reply = tokenizer.decode(output_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)

        # update history
        chat_histories[session_id] = output_ids

        return json_response({"response": reply})
    except Exception as e:
        print("[ERROR]", repr(e))
        return json_response({"response": "Error generating reply."}, status=500)


@app.route("/api/clear_history", methods=["POST"])
def clear_history():
    data = request.get_json(force=True, silent=True) or {}
    session_id = data.get("session_id", "default")
    if session_id in chat_histories:
        del chat_histories[session_id]
    return json_response({"ok": True})


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)


if __name__ == "__main__":
    print(f"🚀 Running at http://{HOST}:{PORT}")
    app.run(debug=True, host=HOST, port=PORT)
