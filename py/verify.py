import face_recognition
import sys

def fun(a):
  image = face_recognition.load_image_file(a)
  face_locations = face_recognition.face_locations(image)
  if len(face_locations)==1:
    return 0
  if len(face_locations)==0:
    return 1
  if len(face_locations)>1:
    return 2

if __name__ == "__main__":
    a = str(sys.argv[1])
    print(fun(a))
    