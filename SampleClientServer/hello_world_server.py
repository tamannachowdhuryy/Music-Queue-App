import http.server
import socketserver
from http import HTTPStatus
import json

preferences = []


class Handler(http.server.SimpleHTTPRequestHandler):
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
        ## Add the request preferences for this single request to the global list
        preferences.append(body_message)
        ## Returns preferences for ALL users across ALL requests
        ## Note that we use the definition from the API to know what field should
        ## exist on the response body. The API definition we agreed upon says
        ## the preferences list should be sorted by name, so we must abide by 
        ## that and sort them.
        sorted_preferences = sorted(preferences, key = lambda pref: pref["name"])
        preferences_list = list(
            map(
                lambda pref: f"%s likes %s cookies"
                % (pref["name"], pref["cookie"]),
                sorted_preferences,
            )
        )

        # Write a response
        self.wfile.write(json.dumps({"preferences": preferences_list}).encode())

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({}).encode())


port_num = 8000
httpd = socketserver.TCPServer(("", port_num), Handler)
print("Starting Up on Port " + str(port_num))
httpd.serve_forever()
