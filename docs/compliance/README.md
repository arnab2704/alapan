# Compliance notes

Engineering notes, **not legal advice**. Have qualified professionals review each item for the countries you launch in (UK ICO Children's Code and Ofcom Online Safety Act guidance, GDPR/UK GDPR, India DPDP, US COPPA/DMCA where relevant) before public launch.

| Document                                                   | Covers                                                            |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| [child-safety-and-privacy.md](child-safety-and-privacy.md) | Child-safe design, data minimisation, retention, deletion, export |
| [copyright-and-provenance.md](copyright-and-provenance.md) | Content sources and licences, uploads, claim workflow             |
| [moderation.md](moderation.md)                             | Reports, block/mute, queue, audit log, appeals, suspension        |
| [../DEPLOYMENT.md](../DEPLOYMENT.md)                       | Environment, migrations, headers, monitoring, launch checklist    |

Public texts live in `apps/web/src/lib/legalContent.ts` (Terms, Privacy, Copyright, Safety) and are served at `/terms`, `/privacy`, `/copyright-policy`, `/safety`. Update `LEGAL_UPDATED` when they change. They are engineering drafts and must be reviewed by counsel; add the operator's legal name, contact address and jurisdiction.
