# 🚀 Deploy Nabombuj na Vercel — kompletní návod

> Cíl: dostat aplikaci na `https://nabombuj.vercel.app` za ~30 minut.

---

## ✅ Co potřebuješ

- Email pro registraci
- Webový prohlížeč
- Tento balíček (`nabombuj-deploy.zip`)

**Nepotřebuješ:** instalovat Node.js, Git, ani nic jiného. Vše uděláme přes web.

---

## 📋 Krok 1: GitHub účet (5 min)

### 1.1 Registrace
- Jdi na **https://github.com**
- Klikni **Sign up** vpravo nahoře
- Zadej email, heslo, username (např. `tvojejmeno`)
- Potvrď email

### 1.2 Nový repository
- Po přihlášení klikni **`+`** vpravo nahoře → **New repository**
- **Repository name:** `nabombuj`
- **Visibility:** Public (zdarma) nebo Private (taky zdarma)
- **❌ NEzaškrtávej** "Add README", "Add .gitignore", "Add license" — máme vlastní
- Klikni **Create repository**
- Zobrazí se ti instrukce — **zatím je ignoruj**, hned je nahradíme

---

## 📦 Krok 2: Nahrát soubory na GitHub (10 min)

### 2.1 Rozbal balíček
- Stáhni `nabombuj-deploy.zip`
- Rozbal ho na disku — uvidíš složku `nabombuj-deploy/` se soubory:
  ```
  nabombuj-deploy/
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ├── .gitignore
  ├── public/
  │   ├── favicon.svg
  │   └── audio/   (11 mp3 souborů)
  └── src/
      ├── main.jsx
      └── statnice-skool.jsx
  ```

### 2.2 Upload přes GitHub web
Na stránce repository (kde si byl po vytvoření):
- Klikni **"uploading an existing file"** (modrý odkaz uprostřed)
- **Drag & drop** všechny soubory ze složky `nabombuj-deploy/` (ne tu složku samotnou, ale její obsah)
- Vlevo dole: **Commit message** = `Initial deploy`
- Klikni **Commit changes**

⚠️ **Pozor na audio:** GitHub má limit 25 MB per file přes web. Naše mp3 mají max 4 MB → OK. Ale celkový upload může být pomalý (30 MB). Buď trpělivý.

### 2.3 Ověř
Po uploadu vidíš v repu strukturu:
```
nabombuj/
├── public/
├── src/
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 🚀 Krok 3: Vercel deploy (10 min)

### 3.1 Registrace na Vercel
- Jdi na **https://vercel.com**
- Klikni **Sign up**
- Vyber **Continue with GitHub** (= propojení účtů)
- Autorizuj přístup
- Při dotazu na plán → **Hobby (Free)**

### 3.2 Nový projekt
- Po přihlášení klikni **Add New...** → **Project**
- Uvidíš seznam svých GitHub repů → klikni **Import** vedle `nabombuj`

### 3.3 Konfigurace
Vercel automaticky detekuje **Vite** a nastaví build:
- **Framework Preset:** Vite ✅ (detekováno)
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅
- **Install Command:** `npm install` ✅

**Nic neměň**, jen klikni **Deploy** dole.

### 3.4 Sleduj build (cca 2 min)
Vidíš live build log. Až bude hotovo, vyskočí **🎉 Congratulations!**

### 3.5 Tvůj web je live!
- URL: `https://nabombuj-XXX.vercel.app` (XXX = random hash)
- Klikni **Visit** → uvidíš svou app

---

## 🌐 Krok 4: Custom URL (volitelné)

### Změna domény na `nabombuj.vercel.app`
- V projektu klikni **Settings** → **Domains**
- Pod default doménou klikni **Edit** (3 tečky)
- Změň na **nabombuj.vercel.app** a **Save**

⚠️ Pokud je `nabombuj.vercel.app` zabraná, zkus `nabombuj-app`, `nabombuj-cz`, atd.

### Vlastní doména (kdykoli později)
- Stejná Settings → Domains → **Add Domain**
- Zadej např. `nabombuj.cz` (musíš ji vlastnit)
- Vercel ti řekne, kam nastavit DNS records u registrátora

---

## ✅ Hotovo! Co teď?

### Otestuj
- Mobil (vyzkoušet na iPhone/Android)
- Search (Cmd+K na Macu, Ctrl+K na Windows)
- Audio přehrávání
- Streak (otevři quiz, zaškrtni odpověď → bombička 💣 se zapálí)

### Sdílej
URL pošli kamarádům — funguje veřejně.

---

## 🔄 Workflow pro updaty (důležité!)

**Každá změna v této Claude konverzaci** = nová verze JSX souboru. Postup pro update:

### Cesta A: GitHub web (nejjednodušší, doporučuju)
1. Stáhneš si nový `statnice-skool.jsx` z této konverzace
2. Jdi na GitHub → repo `nabombuj` → složka `src/`
3. Klikni na `statnice-skool.jsx`
4. Klikni ✏️ (tužka) **Edit this file**
5. Smaž celý obsah (Cmd+A, Delete)
6. Otevři stažený soubor v editoru, zkopíruj obsah, paste do GitHubu
7. Dolů: **Commit changes**
8. Vercel automaticky detekuje commit → build → live za 2 min ✨

### Cesta B: Drag & drop
1. Jdi do `src/` složky na GitHubu
2. Klikni **Add file** → **Upload files**
3. Drag & drop nový `statnice-skool.jsx` (přepíše starý)
4. **Commit changes**
5. Live za 2 min ✨

---

## 🆘 Troubleshooting

### Build selže s "Failed to resolve module"
- Pravděpodobně jsi zapomněl nahrát `package.json` nebo `vite.config.js`
- Zkontroluj GitHub repo — všechny soubory ze ZIP musí být tam

### Audio nehraje
- Otevři DevTools (F12) → Network tab
- Zkus přehrát podcast → uvidíš požadavek na `/audio/mng-1.mp3`
- Pokud 404 → mp3 soubory nejsou v `public/audio/` na GitHubu (znova upload)

### "Module not found: statnice-skool.jsx"
- Soubor musí být přesně v `src/statnice-skool.jsx`
- Case-sensitive (S-tatnice ≠ s-tatnice)

### Web je bílý / prázdný
- Otevři DevTools → Console → uvidíš error
- Pošli mi screenshot, vyřeším

---

## 📊 Limity Vercel Hobby (free)

| Co | Limit |
|---|---|
| Bandwidth | 100 GB/měsíc |
| Build time | 6000 minut/měsíc |
| Deploys | Neomezeně |
| Custom domény | Neomezeně |
| Audio (statické soubory) | OK, počítá se do bandwidth |

**Realistický odhad:** student využívá max ~5 GB/měsíc. **Daleko od limitu.**

---

## 🎯 Co dál po deployi

1. ✅ Nahraj URL do **Cloud Design konverzace** — Bombík redesigner uvidí live site
2. ✅ Sdílej s kamarády — feedback na obsah
3. ✅ Pokračuj se **mnou** v této konverzaci — přidáme **Leadership** + další předměty
4. ✅ Až dostaneš redesign → 1× nahradíš JSX → live nový brand za 2 min

---

**Otázky? Něco nefunguje? Napiš sem v této konverzaci, společně to vyřešíme.**
