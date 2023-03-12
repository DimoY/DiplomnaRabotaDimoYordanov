from flask import Flask,jsonify,request
import numpy as np
import json
from PIL import Image
import cv2
# инициализация на фласк и хаар каскаден калификатор
app = Flask(__name__)

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt2.xml')

# функция която се изпълнява на всеки рекуест към програмния интерфейс
# кода проверява за големината за снимката като за всяко лице което е намерено
# то се добавя в списък който се връща от програмата
@app.route("/api/faceRecognition/", methods=['POST'])
def hello_world():
    list = []
    error = "error"
    if(request.content_length<2024*2024*3*4):
        req = json.loads(request.get_data())
        array = np.array(req["data"]["data"],dtype=np.uint8)
        imageArray = np.reshape(array,(req["height"],req["width"],3))
        grayed = cv2.cvtColor(imageArray, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(grayed, 1.1, 3)
        for (x, y, w, h) in faces:
            list.append({"MinY":int(y),"Height":int(h),"MinX":int(x),"Width":int(w)})
        error = "ok"
    return jsonify({"status":error,"res":list})
