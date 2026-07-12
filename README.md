# ⚖️ Contractly

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**The contract template library you buy once and own forever.** 16 plain-language templates — NDAs, freelance agreements, service contracts, SOWs, releases — with fill-in-the-blanks variables, a rich-text clause editor, live preview, and clean PDF export. 100% local, zero subscription.

PandaDoc gates template features behind **$19+/user/month**. A lawyer charges per document. Contractly is **$29 once**: the blanks, the form that fills them, and the PDF — on your machine.

> ⚠️ **Not legal advice.** These templates are general-purpose starting points. Laws differ by state and country — have a qualified attorney review anything important before you rely on it. This warning is shown in the app and embedded in every template.

![Contractly screenshot](docs/screenshot.png)

## ☕ Skip the setup — get the 1-click installer

Don't want to touch a terminal? Grab the packaged Windows installer (and support development):

**→ [Get Contractly on Whop](https://whop.com/benjisaiempire/contractly)** — pay once, own it forever.

## Features

- 📚 **16 bundled templates** across 6 categories: Mutual & One-Way NDA, Freelance/Contractor, Consulting, Retainer, SOW, General Services, Web Design, Social Media Management, Photography/Video, Sales of Goods, Equipment Rental, Lease Addendum, Media Release, Termination Letter, Payment Plan
- 🔤 **Fill-in-the-blanks variables** — `{{client_name}}`-style placeholders become a form panel; type once, the document updates live, with a filled/blank progress counter
- ✍️ **Edit the contract body itself** — rich-text editor (bold/italic/headings/lists) to customize clauses per business; insert your own `{{variables}}` anywhere
- 💾 **Save your customizations as templates** — your edited NDA becomes *your* NDA for every future client
- 🔁 **Clone for the next client** — reuse a finished contract as the base for the next deal; fields stay independent
- 🖨️ **Clean PDF export** — headless Chromium print (Letter, 1-inch margins, serif typography); unfilled blanks export as `__________` so nothing sneaks through half-merged
- 🖊️ **E-signature handoff** — export merged HTML and open it in [Inkseal](https://github.com/bensblueprints/e-signature) (our pay-once e-signature tool) to collect signatures; Contractly doesn't rebuild signing
- 🛡️ **Injection-safe merge** — field values are HTML-escaped; pasting `<script>` into a form field stays text
- 🔒 **100% local** — one human-readable JSON file in your user-data folder; no account, no cloud, no telemetry
- 🌑 Premium dark UI, framework-free and fast

## Quick start

```bash
git clone https://github.com/bensblueprints/contractly
cd contractly
npm i
npm start
```

Run the tests (template pack integrity, variable extraction, merge + escaping, store CRUD on real files, corrupt-file recovery, and a real Electron `printToPDF` export validated by PDF magic bytes):

```bash
npm test
```

## Tech stack

Electron · vanilla JS renderer (no framework) · contenteditable rich text · `printToPDF` export · atomic JSON storage

## Contractly vs PandaDoc / lawyer-per-doc

| | **Contractly** | PandaDoc | Lawyer per doc |
|---|---|---|---|
| Price | **$29 once** | $19+/user/mo | $300–800/doc |
| Template library | ✅ 16 bundled + yours | ✅ (paid tiers) | n/a |
| Fill-in-the-blanks variables | ✅ | ✅ | ❌ |
| Edit clauses freely | ✅ | ✅ | ✅ |
| Clean PDF export | ✅ | ✅ | ✅ |
| E-signature | ➖ pair with Inkseal | ✅ | ❌ |
| Bespoke legal drafting & advice | ❌ | ❌ | ✅ |
| Works offline, data stays local | ✅ | ❌ | ✅ |
| Cost after year one | **$0** | $228+/user | per doc |

Honest positioning: for a funding round or anything high-stakes, pay the lawyer. For the twentieth NDA and the routine freelance agreement, Contractly turns a $19/mo subscription into a one-time purchase.

## License

MIT © 2026 Ben (bensblueprints) — the software. Template texts are provided as-is, without warranty, and are not legal advice.

## macOS build

See [MAC-BUILD.md](MAC-BUILD.md). Quickest path: GitHub **Actions** tab -> run the **Mac Build** (`mac-build.yml`) workflow to get a downloadable `.dmg` (unsigned - right-click -> Open on first launch).
