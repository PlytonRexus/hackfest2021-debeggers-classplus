import face_recognition
import sys
import numpy as np
import pandas as pd

def fun(a,b,sheet,num):

  known_image = face_recognition.load_image_file(a)
  unknown_image = face_recognition.load_image_file(b)

  known_encoding = face_recognition.face_encodings(known_image)[0]
  unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

  results = face_recognition.compare_faces([known_encoding], unknown_encoding)

  if int(results[0])==0:
    return 0
  else:
    data = pd.read_csv(sheet)
    idx = np.where(np.array(data['Admission_num']==num)==True)[0][0]
    data.iloc[idx, -1]='yes'
    data.to_csv('sheet.csv',index=None)
    return 1

# def fun(a, b, c, d):
#     return 1

if __name__ == "__main__":
    a = str(sys.argv[1])
    b = str(sys.argv[2])
    sheet = str(sys.argv[3])
    num = int(sys.argv[4])
    print(fun(a,b,sheet,num))
