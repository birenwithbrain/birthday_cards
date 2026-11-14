# Birthday Experience v3

A mobile-first, cute, interactive birthday microsite built with React + Vite + TypeScript + Motion.

## Run

```bash
npm install
npm run dev
```

Do not open `index.html` with Live Server. Use the Vite dev server.

## Customize a friend

Edit `src/birthday.ts`. Change the name, age, colors, photo, memories, flashcards, quiz and final message. The UI stays the same.

## Notes

- Demo photos use remote Unsplash URLs. For private birthdays, put images in `public/` and use local paths.
- `moduleResolution` uses `bundler` for TypeScript 6+ / Vite compatibility.


## Vogue fashion section

A new **Vogue** item is included in the bottom navigation and menu. Its layout and copy are in `src/main.tsx` (the `Vogue` component), and its six replaceable photo URLs, alt text, labels and captions are in `src/birthday.ts` under `voguePhotos`. Replace each `image` URL with a photo URL you want to use. The section uses the scrapbook collage style with a magazine cover, overlapping photo cards, a fashion verdict and editor's note.
