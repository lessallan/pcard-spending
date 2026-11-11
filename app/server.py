"""Loopback-only server exposing the dashboard, official photos and policies."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, unquote
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path=unquote(urlparse(self.path).path)
        allowed={'/assets.js':'app/assets.js','/merchant-context.js':'app/merchant-context.js','/travel.json':'docs/travel.json','/assets.json':'docs/assets.json','/leadership-associations.json':'docs/leadership-associations.json','/radar.js':'app/radar.js','/penny-ping-logo.png':'app/penny-ping-logo.png','/porchping-logo.svg':'app/porchping-logo.svg','/spending-blaze-logo.png':'app/spending-blaze-logo.png','/':'app/index.html','/index.html':'app/index.html','/style.css':'app/style.css','/app.js':'app/app.js','/data.json':'docs/data.json'}
        rel=allowed.get(path)
        if path.startswith('/photos/'):rel='docs/'+path.lstrip('/')
        if path.startswith('/policies/'):rel=path.lstrip('/')
        if rel is None:return self.send_error(404)
        dest=(ROOT/rel).resolve()
        permitted=[ROOT/'app',ROOT/'docs',ROOT/'staff/photos',ROOT/'policies']
        if not any(dest.is_relative_to(p) for p in permitted) or not dest.is_file():return self.send_error(404)
        self.send_response(200);self.send_header('Content-Type',self.guess_type(str(dest)));self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.end_headers();self.wfile.write(dest.read_bytes())
    def do_HEAD(self):self.send_error(405)
    def log_message(self,*args):pass
if __name__=='__main__':
    print('Penny Ping: http://127.0.0.1:4310',flush=True)
    ThreadingHTTPServer(('127.0.0.1',4310),Handler).serve_forever()
