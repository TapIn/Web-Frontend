import requests
import os

files = ('error.log', 'access.log')

for file in files:
    if not os.path.exists('/var/log/apache2/' + file):
        continue

    text = ""
    with open('/var/log/apache2/' + file, 'r') as f:
        text = f.read()

    payload = {'contents': text, 'group': 'www', 'file': file}

    requests.post("http://tools.tapin.tv:9099/", data=payload)

    open('/var/log/apache2/' + file, 'w').close()
