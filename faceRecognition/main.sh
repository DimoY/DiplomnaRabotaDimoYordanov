docker run -p 8501:8501 --mount type=bind,source=/run/media/dimoy/d910ca3f-8188-4f99-b7f3-9d2d45aaa2f6/home/dn/Documents/DiplomnaFolder/faceRecognition/models,target=/models/face_recognition/ -e MODEL_NAME=face_recognition -t tensorflow/serving