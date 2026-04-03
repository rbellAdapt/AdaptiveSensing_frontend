import urllib.request
import json
import urllib.error

url = "http://127.0.0.1:8000/api/dissolved-gas"
payload = {
    "temp": 10,
    "tempUnits": "celsius90",
    "salt": 35,
    "saltUnits": "Salinity(PSS_78)",
    "atmPress": 101325,
    "atmPressUnits": "Pa",
    "reportingUnits": "molarity",
    "gasAllNames": ["N2"],
    "moleFractions": [0.78]
}

data = json.dumps(payload).encode('utf-8')
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "adaptivesensing-internal-react-key"
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

try:
    response = urllib.request.urlopen(req)
    print("SUCCESS: ", response.getcode())
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP ERROR: ", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR: ", str(e))
