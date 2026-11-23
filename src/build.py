# Rebuilds ../index.html from the sources in this folder: python3 build.py
import pathlib
d = pathlib.Path(__file__).parent
s = (d/'shell.html').read_text()
s = s.replace('%%MQTT%%', (d/'mqtt.min.js').read_text().replace('</script', '<\\/script'))
s = s.replace('%%CONTENT%%', (d/'content.js').read_text()).replace('%%APP%%', (d/'app.js').read_text())
s = s.replace('%%LOGO_SQ%%', (d/'logo-sq.txt').read_text().strip()).replace('%%LOGO_RECT%%', (d/'logo-rect.txt').read_text().strip())
s = s.replace('%%BUZZER%%', (d/'buzzer-mp3.b64').read_text().strip())
(d.parent/'index.html').write_text(s)
print('index.html rebuilt')
