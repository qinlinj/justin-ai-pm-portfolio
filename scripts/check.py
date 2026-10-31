"""Validate local assets, language coverage, and JavaScript syntax."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.references = []
        self.language = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.language = attrs.get('lang')
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID in {self.path}: {attrs["id"]}'
            self.ids.add(attrs['id'])
        for key in ('src', 'href'):
            if attrs.get(key):
                self.references.append(attrs[key])

for name, language in [('index.html', 'en'), ('zh.html', 'zh-CN')]:
    path = ROOT / 'dist' / name
    page = Page(path)
    page.feed(path.read_text())
    assert page.language == language, f'Wrong page language: {name}'
    for reference in page.references:
        url = urlsplit(reference)
        if url.scheme or url.netloc or not url.path:
            continue
        target = ((ROOT / 'dist' / url.path.lstrip('/')) if url.path.startswith('/') else (path.parent / url.path)).resolve()
        assert target.is_relative_to(ROOT / 'dist'), f'Asset outside dist: {reference}'
        assert target.exists(), f'Missing asset: {reference}'
    assert 'Justin Jia' in path.read_text(), f'Missing owner name: {name}'

for path in (ROOT / 'dist').glob('*.js'):
    subprocess.run(['node', '--check', str(path)], check=True)
    if path.name != 'data.zh.js':
        assert not re.search(r'[\u4e00-\u9fff]', path.read_text()), f'Move Chinese UI strings to locale resources: {path}'
for path in (ROOT / 'scripts').glob('*.py'):
    assert not re.search(r'[\u4e00-\u9fff]', path.read_text()), f'Implementation must use English: {path}'
for path in (ROOT / 'locales').glob('*.json'):
    json.loads(path.read_text())
print('Passed: page languages, unique IDs, local assets, JavaScript syntax, and localization separation.')
