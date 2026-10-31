#!/usr/bin/env python3
"""Local static preview; accepts common dev-server flags without dependencies."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
p = argparse.ArgumentParser()
p.add_argument('--host', default='127.0.0.1')
p.add_argument('--port', type=int, default=8080)
p.add_argument('--strictPort', action='store_true')
a = p.parse_args()
handler = partial(SimpleHTTPRequestHandler, directory=str(Path(__file__).parent / 'web'))
print(f'RepoReel: http://{a.host}:{a.port}', flush=True)
ThreadingHTTPServer((a.host, a.port), handler).serve_forever()
