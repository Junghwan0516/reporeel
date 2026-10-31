from pathlib import Path
import importlib.util
import subprocess
import tempfile
import unittest
import zipfile
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]

class ExportTests(unittest.TestCase):
    def test_gif_decodes_exact_palette_pixels_across_dictionary_resets(self):
        with tempfile.TemporaryDirectory() as tmp:
            gif=Path(tmp)/'test.gif'
            subprocess.run(['node',str(ROOT/'tests/gif-fixture.cjs'),str(gif)],check=True)
            image=Image.open(gif)
            self.assertEqual(image.n_frames,3)
            self.assertEqual(image.info['loop'],0)
            for frame in range(3):
                image.seek(frame)
                self.assertEqual(image.info['duration'],100)
                data=Path(str(gif)+f'.{frame}.rgba').read_bytes()
                rgb=image.convert('RGB')
                for i in range(image.width*image.height):
                    r,g,b=data[i*4:i*4+3]
                    expected=(round((r>>5)*255/7),round((g>>5)*255/7),round((b>>6)*255/3))
                    self.assertEqual(rgb.getpixel((i%image.width,i//image.width)),expected)
            image.close()

    def test_extension_bundle_contains_self_contained_studio(self):
        spec=importlib.util.spec_from_file_location('build',ROOT/'tools/build.py')
        build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)
        with zipfile.ZipFile(build.build()) as archive:
            names=archive.namelist()
            for name in ['manifest.json','worker.js','offscreen.js','pointer.js','studio/index.html','studio/core.js','studio/app.js','studio/gif.js']:
                self.assertIn(name,names)
            self.assertNotIn('studio/downloads/reporeel-extension.zip',names)

    def test_converter_rejects_overwriting_source_and_bad_width(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'source.webm';source.touch()
            result=subprocess.run(['python3',str(ROOT/'tools/convert.py'),str(source),'--mp4',str(source)],capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)
            self.assertIn('output must differ',result.stderr)
            result=subprocess.run(['python3',str(ROOT/'tools/convert.py'),str(source),'--gif',str(Path(tmp)/'out.gif'),'--width','0'],capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)

if __name__=='__main__':unittest.main()
