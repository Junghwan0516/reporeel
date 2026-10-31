# Contributing

Make it easier to show real work. Keep the studio local-first, accessible, and free of remote media processing or required accounts.

1. Start with a small reproducible case using footage you are allowed to share.
2. Keep camera math and file validation in `web/core.js`; render effects in `web/renderer.js` so preview and exports agree.
3. Include a regression check for changes to encoding, timing, bounds, or file import.
4. Run Node and Python tests from the README. Check a narrow viewport and keyboard navigation for UI changes.
5. If editing `web/` or `extension/`, run `python3 tools/build.py` to rebuild the downloadable extension.
6. Do not commit source projects, raw captures, credentials, or private clips. Keep sample footage clearly identified as sample material.

For the capture extension, verify the start/stop flow, tab sharing indicator, pointer coordinates, full-navigation limitations, resource cleanup, and local editor handoff in a supported desktop Chrome. Report what was actually tested.
