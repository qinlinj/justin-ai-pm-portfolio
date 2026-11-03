"""Validate local assets, language coverage, and JavaScript syntax."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import hashlib
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
        self.disclosures = {}
        self.open_disclosures = 0
        self.tabs = []
        self.tabpanels = {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.language = attrs.get('lang')
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID in {self.path}: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'details' and attrs.get('id'):
            self.disclosures[attrs['id']] = 'open' in attrs
        if tag == 'details' and 'open' in attrs:
            self.open_disclosures += 1
        if attrs.get('role') == 'tab':
            self.tabs.append(attrs)
        if attrs.get('role') == 'tabpanel':
            self.tabpanels[attrs['id']] = attrs
        for key in ('src', 'href'):
            if attrs.get(key):
                self.references.append(attrs[key])

for name, language in [('index.html', 'en'), ('zh.html', 'zh-CN')]:
    path = ROOT / 'dist' / name
    page = Page(path)
    page.feed(path.read_text())
    assert page.language == language, f'Wrong page language: {name}'
    assert page.open_disclosures == 0, f'All disclosures must start closed: {name}'
    for reference in page.references:
        url = urlsplit(reference)
        if url.scheme or url.netloc or not url.path:
            continue
        target = ((ROOT / 'dist' / url.path.lstrip('/')) if url.path.startswith('/') else (path.parent / url.path)).resolve()
        assert target.is_relative_to(ROOT / 'dist'), f'Asset outside dist: {reference}'
        assert target.exists(), f'Missing asset: {reference}'
        if target.suffix in ('.css', '.js'):
            digest = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
            assert url.query == f'v={digest}', f'Stale asset URL: {name} {reference}'
    assert 'Justin Jia' in path.read_text(), f'Missing owner name: {name}'
    assert len(page.tabs) == len(page.tabpanels) == 6, f'Six research topics required: {name}'
    assert sum(t.get('aria-selected') == 'true' for t in page.tabs) == 1, 'Select exactly one topic'
    for tab in page.tabs:
        panel = page.tabpanels.get(tab['aria-controls'])
        assert panel and panel['aria-labelledby'] == tab['id'], 'Broken research tab association'
        assert ('hidden' not in panel) == (tab['aria-selected'] == 'true'), 'Topic visibility mismatch'
    research = (ROOT / 'content' / f'research.{"en" if language == "en" else "zh"}.html').read_text()
    assert len(re.findall(r'href="https://', research)) == 7, 'Keep primary research references'
    assert 'Weihai, China' in path.read_text() if language == 'en' else '\u5a01\u6d77' in path.read_text(), 'Incorrect undergraduate location'
    for identifier in ('gtsp-details', 'remex-details', 'profile-background', 'profile-research'):
        assert page.disclosures.get(identifier) is False, f'Detail should start closed: {name} {identifier}'

for path in (ROOT / 'dist').glob('*.js'):
    subprocess.run(['node', '--check', str(path)], check=True)
    if path.name != 'data.zh.js':
        assert not re.search(r'[\u4e00-\u9fff]', path.read_text()), f'Move Chinese UI strings to locale resources: {path}'
for path in (ROOT / 'scripts').glob('*.py'):
    assert not re.search(r'[\u4e00-\u9fff]', path.read_text()), f'Implementation must use English: {path}'
for path in (ROOT / 'locales').glob('*.json'):
    json.loads(path.read_text())

# CSS masks carry navigation and disclosure cues, so missing SVGs are functional failures.
for path in (ROOT / 'dist').glob('*.css'):
    for reference in re.findall(r'url\([\'"]?([^\'"\)]+)', path.read_text()):
        if urlsplit(reference).scheme or reference.startswith('#'):
            continue
        target = (path.parent / reference).resolve()
        assert target.is_relative_to(ROOT / 'dist') and target.is_file(), f'Missing CSS asset: {reference}'
print('Passed: page languages, unique IDs, local assets, JavaScript syntax, and localization separation.')

# Guard the editorial boundaries and links used by the case navigation.
studies_source = (ROOT / 'dist/studies.js').read_text()
data_source = studies_source.split('const studySignals =', 1)[0]
english_groups = json.loads(subprocess.check_output(
    ['node', '-e', data_source + '\nprocess.stdout.write(JSON.stringify(groups));'], text=True))
chinese_groups = json.loads((ROOT / 'locales/zh-studies.json').read_text())['groups']
assert [g['id'] for g in english_groups] == [g['id'] for g in chinese_groups], 'Study groups differ between languages'
assert [len(g['items']) for g in english_groups] == [len(g['items']) for g in chinese_groups], 'Study coverage differs between languages'
assert sum(len(g['items']) for g in english_groups) == 9, 'Preserve all nine architecture notes'
for groups in (english_groups, chinese_groups):
    for group in groups:
        for study in group['items']:
            for field in ('title', 'sub', 'flow', 'problem', 'architecture', 'decisions', 'evaluation'):
                assert study.get(field), f'Missing study field: {field}'
            assert len(study['flow']) >= 4, 'Preserve architecture flow depth'
dynamic_ids = {g['id'] for g in english_groups} | {'foundations'}
study_ids = {'study-docs', 'study-research', 'study-support', 'study-trip', 'study-fact', 'study-multimodal', 'study-video', 'study-reasoning', 'study-coding'}
english_contexts = json.loads(re.search(r'const caseContexts = (\{.*?\n\});', studies_source, re.S)[1])
chinese_contexts = json.loads((ROOT / 'locales/zh-studies.json').read_text())['contexts']
for contexts in (english_contexts, chinese_contexts):
    assert set(contexts) == study_ids, 'Every architecture note needs an experience and decision boundary'
    for context in contexts.values():
        for field in ('source', 'sourceLabel', 'bridge', 'connection', 'can', 'stop', 'human'):
            assert context.get(field), f'Missing case connection field: {field}'
assert all(repr(identifier) in studies_source for identifier in study_ids), 'Missing stable case ID'
dynamic_ids |= study_ids
for name in ('index.html', 'zh.html'):
    page = Page(ROOT / 'dist' / name)
    source = page.path.read_text()
    page.feed(source)
    contexts = english_contexts if name == 'index.html' else chinese_contexts
    assert all(context['source'] in page.ids for context in contexts.values()), 'Broken experience source link'
    assert source.count('class="case-boundary"') == 2, 'Both delivered Agent cases need a visible decision boundary'
    for reference in page.references:
        url = urlsplit(reference)
        if not url.scheme and not url.netloc and not url.path and url.fragment:
            assert url.fragment in page.ids | dynamic_ids, f'Broken section link: {name} {reference}'
    assert source.count('class="scope-boundary"') == 2, 'Show both implementation scope notes before expansion'
    assert source.count('href="about:blank" aria-disabled="true"') == 3, 'Keep unpublished contact destinations disabled'
    assert 'id="contact" hidden' not in source and 'href="#contact" hidden' not in source, 'Keep contact entry visible'
    assert source.count('class="insight-link"') == 3, 'Connect each perspective to a case'
    assert 'Propose' in source and 'Approve' in source and 'Record' in source, 'Preserve approval method'
    for metric in ('4.2%', '40%', '15%', '35%', '5TB+', '1TB+', '27'):
        assert metric in source, f'Missing supplied metric: {name} {metric}'
print('Passed: nine bilingual studies, case depth, anchor targets, scope notes, contact state, and supplied metrics.')
