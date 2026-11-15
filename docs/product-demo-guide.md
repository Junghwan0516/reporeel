# Record a product demo worth putting in a pitch deck

Use [RepoReel Studio](https://junghwan0516.github.io/reporeel/) to turn one product interaction into a short, silent clip. You can use the built-in screen recorder or import an MP4/WebM. Neither requires the capture extension.

## Worked storyboard: Lumen Edu

This is a **shooting plan**, not a published recording. Use a demo account, a fictional student, and a prepared example. Adjust the wording to match what the current product actually shows.

**Story:** A student starts with a broad topic, answers a question that narrows it, and ends with a testable plan and a visible record of how they got there.

| Target time | Screen action | Caption |
|---|---|---|
| 0–4s | Enter a broad topic: “How does insulation affect heat loss?” | Start with a broad science question. |
| 4–9s | Open a follow-up question and answer with one variable, such as insulation thickness. | A follow-up question helps narrow the investigation. |
| 9–15s | Show the refined comparison and how it will be measured. | The student defines what to vary and what to measure. |
| 15–20s | Open the Thinking Log and show the progression from idea to plan. | The Thinking Log makes the student’s reasoning visible. |

**For the pitch:** Play the clip on the product slide while you explain what changed between the first and last screens. A standalone clip should still make sense with the audio off. For a longer live presentation, capture additional workflows as separate clips rather than cutting away from this story.

## Record and edit

1. Open your product in a regular browser tab. Turn off notifications and hide real student names, account data, and browser chrome before recording.
2. In RepoReel, select **Record screen** and choose the product tab. Walk through the prepared scenario. If your browser cannot capture the tab, record elsewhere and import the clip instead.
3. Pick the **Pitch deck** preset for 16:9 framing, then trim the clip. Use **Add focus** at the two points where attention matters most. Add short captions where the meaning would otherwise be unclear.
4. Scrub from start to finish and review the whole frame. If needed, use opaque redactions. A saved `.reel.json` project still contains the original footage; share only the reviewed export.
5. Pause on a key moment and use **Before / after → Save comparison PNG** if you want a side-by-side image. The same redactions are rendered in both views. Then export the edit for the channels below.

| Channel | Recommended output |
|---|---|
| **IR slide** | 16:9 silent WebM, converted to MP4 for use in your deck. Test playback in the actual presentation setup. Use the PNG cover as a fallback. |
| **GitHub README** | A short looping GIF. RepoReel’s browser GIF export is limited to 20 seconds. Put the clip in your project repo with a one-sentence caption. |
| **LinkedIn** | A short MP4 with captions; a square or 16:9 layout can work. Lead with the visible outcome and link to the project or studio. |

With FFmpeg installed, convert from a clone of RepoReel:

```sh
python3 tools/convert.py demo.webm --mp4 demo.mp4
```

For the README, add the exported GIF to your own repository:

```md
![A student narrows a science question and opens their Thinking Log](docs/demo.gif)
```

## Share a result people can reproduce

Show the finished clip, then link to the studio and the steps used to make it. Describe the difference between the original recording and the finished clip. If RepoReel was useful, a star helps others discover it; if a step did not work, report the browser, input format, and export mode without attaching private footage.
