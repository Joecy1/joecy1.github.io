import os,sys,subprocess
try:
    import markdown
except Exception:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown"]) 
    import markdown

files = ["projects.md","about.md","teaching-plan.md","citation.md"]

template = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{TITLE}}</title>
  <meta name="description" content="Personal portfolio page">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="hero">
    <div class="container"><h1>{{TITLE}}</h1></div>
  </header>
  <main class="container">
    {{BODY}}
  </main>
  <footer class="container">
    <p><a href="/">Home</a> • Built with GitHub Pages</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>'''

created = []
for f in files:
    if not os.path.exists(f):
        print(f"Skipping missing {f}")
        continue
    md = open(f,encoding='utf8').read()
    title = None
    for line in md.splitlines():
        line = line.strip()
        if line.startswith('# '):
            title = line.lstrip('# ').strip(); break
        if line.lower().startswith('title:'):
            title = line.split(':',1)[1].strip(); break
    if not title:
        title = os.path.splitext(os.path.basename(f))[0].replace('-', ' ').title()
    body = markdown.markdown(md, extensions=['fenced_code','tables'])
    html = template.replace('{{TITLE}}', title).replace('{{BODY}}', body)
    out = os.path.splitext(f)[0] + '.html'
    with open(out,'w',encoding='utf8') as w:
        w.write(html)
    created.append(out)
print('Created:', created)

# git add/commit/push
subprocess.check_call(['git','add','-A'])
# only commit if there are staged changes
rc = subprocess.call(['git','diff','--cached','--quiet'])
if rc != 0:
    subprocess.check_call(['git','commit','-m','Add HTML copies of markdown pages and update links\n\nCo-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>'])
    subprocess.check_call(['git','push','--set-upstream','origin','HEAD'])
else:
    print('No changes to commit')
