#!/usr/bin/env python3
import os
import gzip
import io
from http.server import HTTPServer, SimpleHTTPRequestHandler

class GzipHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.translate_path(self.path)
        is_text_file = path.endswith((
            '.html', '.css', '.js', '.json', '.svg', '.txt', '.xml', '.md'
        ))

        if is_text_file and os.path.isfile(path):
            self.send_header('Content-Encoding', 'gzip')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        is_text_file = path.endswith((
            '.html', '.css', '.js', '.json', '.svg', '.txt', '.xml', '.md'
        ))

        if self.command == 'GET' and os.path.isfile(path) and is_text_file:
            with open(path, 'rb') as f:
                content = f.read()

            compressed = io.BytesIO()
            with gzip.GzipFile(fileobj=compressed, mode='wb', compresslevel=6) as f:
                f.write(content)
            compressed.seek(0)

            ctype = self.guess_type(path)
            self.send_response(200)
            self.send_header('Content-type', ctype)
            self.send_header('Content-Length', str(len(compressed.getvalue())))
            self.end_headers()
            return compressed
        else:
            return super().send_head()

if __name__ == '__main__':
    port = 8000
    httpd = HTTPServer(('0.0.0.0', port), GzipHandler)
    print(f"✅ GZIP 静态服务器启动：http://localhost:{port}")
    print(f"✅ 局域网访问：找你的本机 IP + 端口")
    httpd.serve_forever()