import face_recognition
import sys

def fun(a,b):
  known_image = face_recognition.load_image_file(a)
  unknown_image = face_recognition.load_image_file(b)

  known_encoding = face_recognition.face_encodings(known_image)[0]
  unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

  results = face_recognition.compare_faces([known_encoding], unknown_encoding)
  return int(results[0])

if __name__ == "__main__":
    a = str(sys.argv[1])
    b = str(sys.argv[2])
    print(fun(a,b))
    