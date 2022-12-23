#Create JSON Object
import json
import requests
import numpy as np
import cv2

my_face = np.asarray(cv2.resize(cv2.imread("detcted.jpg"),dsize=(32,32), interpolation = cv2.INTER_CUBIC)).tolist()
data = json.dumps({"signature_name": "serving_default", "instances":[my_face]})

headers = {"content-type": "application/json"}
json_response = requests.post('http://localhost:8501/v1/models/face_recognition:predict', data=data, headers=headers)
predictions = json.loads(json_response.text)['predictions']
#%%
print(predictions)