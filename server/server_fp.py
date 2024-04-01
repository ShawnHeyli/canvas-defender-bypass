#!/usr/bin/env python3
from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from http.server import SimpleHTTPRequestHandler
import json
import base64
import mimetypes
from PIL import Image

def fingerprint_from_noised(noised: str, r: int, g: int, b: int, a: int):
    noised_canvas = Image.open(noised)
    pix = noised_canvas.load()
    for i in range(noised_canvas.size[0]):
        for j in range(noised_canvas.size[1]):
            pr, pg, pb, pa = pix[i,j]

            pix[i,j] = (pr - r, pg - g, pb - b, pa - a)
    
    noised_canvas.save("unnoised.png")
    data = base64.b64encode(noised_canvas.tobytes()).decode("utf-8")
    return data

#Python webserver
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':        
            self.path = '/index.html'
            mime_type, _ = mimetypes.guess_type(self.path)
            with open('.' + self.path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', mime_type)
            self.end_headers()
            self.wfile.write(bytes(content))
        else:
            self.send_response(404, "Not found")
            self.end_headers()
            self.wfile.write(b"<h1>Error 404: Not Found</h1>")

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        post_data = json.loads(post_data)
        noised = post_data['noised']
        if(post_data['noise'] == None):
            print("Without noise: ", noised)
        else:
            noise = post_data['noise'].split(',')
            r = int(noise[0])
            g = int(noise[1])
            b = int(noise[2])
            a = int(noise[3])
            fingerprint = fingerprint_from_noised(noised, r, g, b, a)
            print("With noise: ", fingerprint)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"fingerprint": fingerprint}).encode())

httpd = HTTPServer(('localhost', 3000), SimpleHTTPRequestHandler)
#no ssl
httpd.serve_forever()

