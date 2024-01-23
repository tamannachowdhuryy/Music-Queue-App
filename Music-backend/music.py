import http.server
import socketserver
from http import HTTPStatus
import json


class Handler(http.server.SimpleHTTPRequestHandler):

    preferences = {}

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
            song = body_message['song']

            if song in self.preferences:
                self.preferences[song] = self.preferences[song] + 1
            else:
                self.preferences[song] = 1

            # preferences.append(body_message)
            # sorted_preferences = sorted(preferences, key = lambda pref: pref["song"])
            # preferences_list = list(
            #     map(
            #         lambda pref: f"%s | %s"
            #         % (pref["song"], pref["artist"]),
            #         sorted_preferences,
            #     )
            # )
        # Write a response
            self.wfile.write(json.dumps({"preferences": self.getPreference()}).encode())

        elif (self.path == '/votes'):
            song = body_message['song']
            isUpvote = body_message['isUpvote']

            if (isUpvote):
                self.preferences[song] += 1
            else:
                self.preferences[song] -= 1
                
            print(song)   
            self.wfile.write(json.dumps({"preferences": self.getPreference()}).encode())

            
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({}).encode())


        if(self.path == '/votes'):
            print('hi')
            self.wfile.write(json.dumps({'songNames' : self.preferences}).encode())
            return 
        self.wfile.write(json.dumps({}).encode())
        print('hi2')


    def getPreference(self):
        # return list of song names in order 
        # return an array of objects
        # [{song: '', vote: int}, {song: '', vote: int}, {song: '', vote: int}, {song: '', vote: int}]
        songList = [{'song': song, 'vote': self.preferences[song]} for song in self.preferences]
        sorted_songList = sorted(songList, key = lambda songStruct: songStruct['vote'])
        sorted_songList.reverse()
        return sorted_songList



port_num = 8000
httpd = socketserver.TCPServer(("", port_num), Handler)
print("Starting Up on Port " + str(port_num))
httpd.serve_forever()
