# mail-draft-tools README

## Build

### Prepare (Windows)

```
winget install Node.js
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
npm -v
winget install Git.Git
npm install -g @vscode/vsce
```

### Initial

```
npx --package yo --package generator-code -- yo code
```

### Test

```
npm run test:unit
```

### Build

private build:

```
npx @vscode/vsce package --allow-missing-repository
```

for publish:

```
vsce package
```

### Install

```
code --install-extension .\mail-draft-tools-x.y.z.vsix
```
