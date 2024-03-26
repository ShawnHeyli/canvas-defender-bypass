#!/usr/bin/env python3
from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from http.server import SimpleHTTPRequestHandler
import ssl
import mimetypes


class myHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Order matters !
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

httpd =  HTTPServer(("localhost", 8443), myHTTPRequestHandler) 
httpd.serve_forever()

