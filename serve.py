#!/usr/bin/python

import SimpleHTTPServer
import SocketServer

Handler   = SimpleHTTPServer.SimpleHTTPRequestHandler

redirect  = "<body></body>"
redirect += "<script>"
redirect += "window.location.hash = ''\n"
redirect += "var target = window.location.pathname.replace('/','').trim()\n"
redirect += "document.location.href='/#'+(target)\n"
redirect += "</script>"

Handler.error_message_format = redirect
httpd = SocketServer.TCPServer(("", 8080), Handler)
httpd.serve_forever()