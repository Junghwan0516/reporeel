#!/usr/bin/env python3
"""Convert a RepoReel video export locally with FFmpeg. Never uses a shell."""
import argparse
from pathlib import Path
import shutil
import subprocess
import sys

def main(argv=None):
    parser=argparse.ArgumentParser(description='Convert a silent RepoReel video export to MP4 or GIF locally.')
    parser.add_argument('input',type=Path)
    parser.add_argument('--mp4',type=Path)
    parser.add_argument('--gif',type=Path)
    parser.add_argument('--width',type=int,default=640)
    args=parser.parse_args(argv)
    if not args.mp4 and not args.gif: parser.error('choose --mp4 OUTPUT and/or --gif OUTPUT')
    if not 160<=args.width<=1920: parser.error('--width must be between 160 and 1920')
    if not args.input.is_file(): parser.error('input file not found')
    outputs=[x for x in (args.mp4,args.gif) if x]
    if any(x.resolve()==args.input.resolve() for x in outputs): parser.error('output must differ from input')
    if len({x.resolve() for x in outputs})!=len(outputs): parser.error('output paths must be distinct')
    if not shutil.which('ffmpeg'): parser.error('FFmpeg is required and was not found in PATH')
    try:
        if args.mp4:
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-n','-i',str(args.input.resolve()),'-an','-c:v','libx264','-pix_fmt','yuv420p','-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2','-movflags','+faststart',str(args.mp4.resolve())],check=True)
        if args.gif:
            graph=f'fps=10,scale={args.width}:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse'
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-n','-i',str(args.input.resolve()),'-an','-filter_complex',graph,str(args.gif.resolve())],check=True)
        return 0
    except subprocess.CalledProcessError as error:
        print(f'Conversion failed (FFmpeg exit {error.returncode}). Existing files are never overwritten.',file=sys.stderr)
        return 1

if __name__=='__main__':
    sys.exit(main())
