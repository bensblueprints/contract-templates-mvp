# Launch strategy — Contractly

## Target communities

- **r/freelance** — the #1 recurring thread is "what contract do you use?" Answer genuinely with clause-level advice, mention the tool as how you manage YOUR templates (no link-dropping; check weekly promo thread rules)
- **r/smallbusiness** — angle: "stop paying per-month for documents"; their rules allow tools in comments when asked
- **r/Entrepreneur** — build-in-public post on productizing the 20% of PandaDoc people actually use
- **r/graphic_design + r/webdev** — client-contract horror stories threads; lead with the free MIT repo
- **Indie Hackers** — "I bundled 16 contracts and a merge engine into a $29 desktop app" write-up

## Show HN draft

**Title:** Show HN: Contractly – local fill-in-the-blanks contract templates (Electron, MIT)

**Body:**
Freelance contract tooling is either $19+/user/month SaaS or a folder of Word docs you find-and-replace at 11pm before a kickoff.

Contractly is the middle path: 16 plain-language templates (NDA, contractor, SOW, releases…) with {{snake_case}} variables. The variables become a form; the form live-merges into a preview; export is Chromium printToPDF with unfilled blanks rendered as ______ so a half-merged doc is obvious.

Technical bits HN may enjoy:
- The merge engine HTML-escapes all field values — template text is trusted, user input never is
- Preview and export share one document shell, so WYSIWYG is literal
- Storage is a single atomic-write JSON file (tmp+rename), with corrupt-file quarantine
- Rich-text clause editing is plain contenteditable + execCommand — no editor framework, the whole renderer is dependency-free

Prominent disclaimer in-app and in every template: not legal advice. For high-stakes work, hire counsel; this is for NDA #20.

MIT source; $29 buys the packaged installer.

## SEO keywords (10)

1. free contract templates editable
2. freelance agreement template generator
3. nda template tool
4. contract builder desktop
5. fill in the blank contract software
6. pandadoc alternative one time purchase
7. independent contractor agreement template
8. statement of work template generator
9. contract template software offline
10. small business contract templates

## AppSumo / PitchGround pitch

Contractly gives every freelancer and small business the 16 contracts they actually reuse — NDAs, contractor agreements, SOWs, releases — as a fill-in-the-blanks desktop app: variables become a form, the document live-updates, and a clean PDF comes out. Buyers customize clauses once and save their own template library, then clone per client forever. No per-seat pricing, no cloud, prominent not-legal-advice positioning that keeps expectations honest. Lifetime-deal audiences love replacing $228/yr subscriptions with a $29 tool they own.

## Pricing math

- Contractly: **$29 one-time**
- PandaDoc Essentials (template features): $19/user/mo → **pays for itself in 1.5 months**
- One lawyer-drafted routine NDA: $300+ → pays for itself the first document
- Suggested launch pricing: $19 early-bird week → $29 standard
