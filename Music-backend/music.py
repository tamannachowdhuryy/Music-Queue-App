import http.server
import socketserver
from http import HTTPStatus
import json



class Handler(http.server.SimpleHTTPRequestHandler):
    preferences = {

    }


    def do_POST(self):
        # Set the required headers for the POST request.
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        # Read the body of the request. This is the "body" we set in the Javascript code.
        content_length = int(self.headers["Content-Length"])
        body = self.rfile.read(content_length)
        body_message = json.loads(body)

        # Do some processing logic. This is the "meat and potatoes" of your app.
        print("Recieved Request: ")
        print(body_message)
        if (self.path == '/songs'): 
            print('/songs')
            for song in body_message['songNames']:
                if song == '':
                    continue
                if song in self.preferences:
                    self.preferences[song] = self.preferences[song] + 1
                else:
                    self.preferences[song] = 1
                
            # self.preferences += (body_message['songNames']) 
            print(self.preferences)
            self.wfile.write(json.dumps({}).encode())
        elif (self.path == '/votes'):
            print('vote')
            

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        print(self.path)

        if(self.path == '/votes'):
            print('hi')
            self.wfile.write(json.dumps({'songNames' : self.preferences}).encode())
            return 
        self.wfile.write(json.dumps({}).encode())
        print('hi2')


port_num = 8000
httpd = socketserver.TCPServer(("", port_num), Handler)
print("Starting Up on Port " + str(port_num))
httpd.serve_forever()
