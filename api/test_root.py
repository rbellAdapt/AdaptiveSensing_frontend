import urllib.request
try:
    response = urllib.request.urlopen("http://127.0.0.1:8000/")
    print("SUCCESS: ", response.getcode())
    print(response.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR: ", str(e))
