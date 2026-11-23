# Maintenance Relay

Team game for light aircraft mechanics (Emerald Language Learning): 2 teams of 3–4, 5 rounds, a point counter, one device per team.

1. **Part & Scenario Relay** – one team explains a repair without the taboo words, the other team finds the part (3 tries, 60 s).
2. **Technical Trivia** – picture questions, both teams answer on their own device (30 s).
3. **Aircraft Rebus** – 5 rebuses give 5 aircraft words; their first letters make a mystery word.
4. **Hangar Simulations** – mechanics question the "pilot" team, then choose a diagnosis (4 min).
5. **Dialogue Challenge** – 2-minute non-stop dialogue; the other team buzzes on a hesitation and takes over.

## Playing
- Web: `https://emeraldlanguagelearning.github.io/Maintenance-Relay/` (iPad: Safari).
- Android: download `MaintenanceRelay.apk` from the **latest** release.
- Team A device: **Host the game** → shows a 4-character room code. Team B device: **Join** with that code. Both devices need the internet (same Wi-Fi is best).
- No internet / one screen only: **Play on one device**.
- Menu ☰: jump to a round, end a round, pause the clock, adjust scores, new game.

## Editing
Content is in `src/content.js`, logic in `src/app.js`, styles in `src/shell.html`. Run `python3 src/build.py` to rebuild `index.html`. Pushing to `main` rebuilds the APK.

## Sound
The buzzer sound was synthesised for this game (118 Hz harmonic tone, 1.2 s) and is released under CC0 – no attribution needed. Source data: `src/buzzer-mp3.b64` (base64 MP3).
