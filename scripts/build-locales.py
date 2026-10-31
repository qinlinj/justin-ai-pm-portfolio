from pathlib import Path
from html.parser import HTMLParser
import json, html, re
root=Path(__file__).resolve().parent.parent
ui=json.loads((root/'locales/zh-ui.json').read_text())
translations=json.loads((root/'locales/zh-static.json').read_text())
class Translate(HTMLParser):
 def __init__(self): super().__init__(convert_charrefs=True); self.out=[]; self.missing=[]; self.native=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html': a['lang']='zh-CN'
  if tag=='a' and a.get('class')=='lang-en': a.pop('aria-current',None)
  if tag=='a' and a.get('class')=='lang-zh': a['aria-current']='page'
  arias=ui['aria']
  if a.get('aria-label') in arias:a['aria-label']=arias[a['aria-label']]
  if tag=='meta' and a.get('name')=='description':a['content']=ui['description']
  self.out.append('<'+tag+''.join(' '+k+('="'+html.escape(v,quote=True)+'"' if v is not None else '') for k,v in a.items())+'>')
 def handle_endtag(self,tag):self.out.append('</'+tag+'>')
 def handle_data(self,data):
  stripped=data.strip()
  if self.native:
   self.out.append(html.escape(data)); return
  if stripped in translations:
   self.out.append(html.escape(data.replace(stripped,translations[stripped])))
  else:
   self.out.append(html.escape(data))
   if any(c.isalpha() for c in stripped) and stripped not in ['j','Justin Jia','GitHub','LinkedIn','EN',ui['languageName']]:self.missing.append(stripped)
 def handle_decl(self,d):self.out.append('<!'+d+'>')
 def handle_comment(self,d):
  if d.strip() in ['career-start','insights-start']: self.native=True
  if d.strip() in ['career-end','insights-end']: self.native=False
  self.out.append('<!--'+d+'-->')
source=(root/'dist/index.html').read_text()
for section in ('career', 'insights'):
 source=re.sub(r'<!--'+section+r'-start-->.*?<!--'+section+r'-end-->', lambda _, section=section: '<!--'+section+'-start-->\n'+(root/('content/'+section+'.en.html')).read_text()+'\n<!--'+section+'-end-->', source, flags=re.S)
(root/'dist/index.html').write_text(source)
p=Translate();p.feed(source)
if p.missing:raise ValueError('Missing translations: '+repr(p.missing))
zh=''.join(p.out)
zh=re.sub(r'<!--career-start-->.*?<!--career-end-->', lambda _: '<!--career-start-->\n'+(root/'content/career.zh.html').read_text()+'\n<!--career-end-->', zh, flags=re.S)
zh=re.sub(r'<!--insights-start-->.*?<!--insights-end-->', lambda _: '<!--insights-start-->\n'+(root/'content/insights.zh.html').read_text()+'\n<!--insights-end-->', zh, flags=re.S)
zh=zh.replace('<script src="studies.js">','<script src="data.zh.js"></script><script src="studies.js">')
(root/'dist/zh.html').write_text(zh)
data=json.loads((root/'locales/zh-studies.json').read_text())
data['labels']=ui['labels']
(root/'dist/data.zh.js').write_text('window.studyLocaleData = '+json.dumps(data,ensure_ascii=False)+';\n')
print('Built complete Chinese page and nine localized studies; all static text covered.')
