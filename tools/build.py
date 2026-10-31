#!/usr/bin/env python3
"""Package an unpacked Chrome extension. No third-party Python packages required."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]

def build():
    output = ROOT / 'web' / 'downloads' / 'reporeel-extension.zip'
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
        for p in sorted((ROOT / 'extension').rglob('*')):
            if p.is_file():
                archive.write(p, p.relative_to(ROOT / 'extension'))
        for p in sorted((ROOT / 'web').iterdir()):
            if p.is_file() and p.suffix in ('.html', '.css', '.js', '.mp4'):
                archive.write(p, Path('studio') / p.name)
    print(f'Extension ready: {output}')
    return output

if __name__ == '__main__':
    build()
