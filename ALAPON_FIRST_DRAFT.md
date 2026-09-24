# Alapon --- Bengali Digital Culture Platform

## First Draft Product & Technical Specification

**Working title:** Alapon (আলাপন)\
**Tagline:** Our roots. Always with us.\
**Launch target:** Sharodiya 1433 / Durga Puja 2026\
**Status:** First engineering/product draft

> This document is a product and engineering specification, not legal
> advice. Copyright, privacy, online-safety, child-safety, advertising
> and payments requirements should be reviewed by qualified
> professionals before public launch.

## 1. Vision

Alapon is a Bengali-first digital home for culture, play, learning and
community.

It is **not** intended to be another Facebook or Instagram. The product
should create a focused Bengali experience built around:

- Bengali games
- Bengali language and word experiences
- Bengali calendar and daily cultural information
- Bengali history, literature, music, cinema, food and traditions
- Festival experiences
- Theke Adda (ঠেকের আড্ডা)
- Bengali quizzes and daily challenges
- Bengali business and event discovery
- Later: creators, commerce and Bengali APIs

The core experience should remain free.

The initial product objective is simple:

> Give people a reason to come back tomorrow.

## 2. Product Pillars

### Today

The homepage should answer: **What is happening in the Bengali world
today?**

Modules:

- Bengali date
- Gregorian date
- festival/event
- countdown
- Bengali word of the day
- person of the day
- historical event
- daily quiz
- daily game
- trending Adda
- cultural recommendation

### Play

Initial games:

1.  Daily Bengali Word Challenge
2.  Bengali Quiz
3.  Simple Bengali word game
4.  ShobdoShakti foundation

Future:

- crossword
- word jumble
- word chain
- anagram
- memory
- spelling challenge
- festival challenges
- children's learning games

### Theke Adda

Positioning:

> এক কাপ চা, অনেক কথা।

Start with curated discussions, comments, reactions, polls and reports.

Do **not** start with unrestricted messaging.

Potential sections:

- আজকের আড্ডা
- মতামত
- হাসির আড্ডা
- গল্পের আসর
- গান-বাজনা
- সিনেমা আড্ডা
- খাওয়া-দাওয়া
- প্রবাসের আড্ডা
- পুজোর আড্ডা

Future:

- Memory Adda
- Ask the Adda
- Expert Adda
- friendly cultural polls
- creator communities

### Learn

- Bengali alphabet
- vocabulary
- pronunciation
- daily word
- meanings
- example sentences
- stories
- quizzes
- children's learning
- later: teachers and courses

### Discover

Structured content for:

- people
- literature
- books
- music
- cinema
- theatre
- food
- places
- history
- festivals
- traditions
- art
- science
- education

### Celebrate

Launch with **Sharodiya 1433**:

- Mahalaya
- Shasthi
- Saptami
- Ashtami
- Nabami
- Dashami
- Puja calendar
- countdown
- Puja Passport
- daily challenges
- cultural information
- diaspora events

Religious imagery should be treated respectfully. Sacred figures should
not become game rewards.

### Calendar

- Bengali date
- Gregorian date
- festival
- holiday
- appropriately sourced tithi information
- events
- reminders later

## 3. Why People Come

The primary hook should not be "join our community."

Use:

> Can you beat today's Bengali challenge?

Loop:

```text
Challenge
  ↓
Score
  ↓
Share
  ↓
Today's Bengali
  ↓
Culture
  ↓
Theke Adda
  ↓
Return tomorrow
```

Core return reasons:

- daily utility
- competition
- curiosity
- nostalgia
- cultural identity
- community
- learning
- seasonal events

Facebook and Instagram should initially be **distribution channels**,
not enemies.

Example:

```text
Alapon challenge
  ↓
"I scored 94%"
  ↓
Share card
  ↓
Facebook / Instagram / WhatsApp
  ↓
Friend clicks
  ↓
Challenge
  ↓
New user
```

## 4. Revenue Model

Keep the core experience free.

### Sponsorships

- Today's Adda
- Puja Passport
- Daily Bengali Challenge
- festival campaigns
- cultural campaigns

### Contextual advertising

Use limited, relevant advertising. Avoid aggressive ad density. Avoid
behavioural profiling of children.

### Business directory

Free basic listing plus paid:

- featured placement
- promoted listings
- offers
- events
- photos
- analytics
- verification

### Event promotion

Paid promotion for:

- Puja
- concerts
- theatre
- workshops
- cultural events

### Creator marketplace

Later:

- courses
- workshops
- ebooks
- tickets
- digital products
- merchandise

### Affiliate commerce

Possible categories:

- books
- Bengali clothing
- musical instruments
- gifts
- events
- travel
- food

### B2B API

Later:

```text
/calendar
/festivals
/words
/dictionary
/quiz
/culture
/people
```

Potential customers:

- education companies
- apps
- publishers
- developers
- cultural organisations
- language/AI companies

## 5. Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui or custom components
- Framer Motion
- PWA
- responsive design

### Backend

Start with Next.js App Router, Route Handlers and Server Actions where
appropriate.

Move selected domains to NestJS services only when scale requires it.

### Database

- PostgreSQL
- Supabase is a good MVP option

### Cache / jobs

- Redis

Use for:

- leaderboards
- caching
- rate limiting
- temporary game state
- jobs

### Storage

- Cloudflare R2 or S3-compatible storage

### CDN / security

- Cloudflare

### CMS

- Payload CMS preferred
- Sanity/Strapi alternatives

### Search

MVP: PostgreSQL full-text search

Later: OpenSearch

### Analytics

- PostHog

### Monitoring

- Sentry

### Payments

- Stripe
- Razorpay for India if required

### AI

Use AI for:

- moderation assistance
- content drafting
- semantic search
- classification
- translation assistance

AI must not be the sole authority for serious moderation/legal
decisions.

## 6. Architecture

Start as a **modular monolith**.

```text
                    USERS
                      |
                 CLOUDFLARE
                      |
                 NEXT.JS APP
                      |
        +-------------+-------------+
        |             |             |
       TODAY         PLAY         ADDA
        |             |             |
        +-------------+-------------+
                      |
                 APPLICATION
                    MODULES
                      |
     +----------------+----------------+
     |        |       |       |        |
    AUTH    GAMES   CONTENT  MOD     BUSINESS
     |        |       |       |        |
     +----------------+----------------+
                      |
                  POSTGRESQL
                      |
              +-------+-------+
              |               |
             REDIS          R2/S3
```

Do not start with Kubernetes, Kafka, 15 microservices, native
iOS/Android, custom video streaming or a dedicated AI platform.

## 7. Repository Structure

```text
alapon/
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   ├── bengali/
│   ├── game-engine/
│   ├── moderation/
│   └── content/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
├── docs/
│   ├── architecture/
│   ├── product/
│   ├── compliance/
│   └── decisions/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
├── .env.example
├── package.json
└── README.md
```

## 8. Domain Modules

```text
modules/
├── auth/
├── users/
├── profiles/
├── today/
├── calendar/
├── festivals/
├── culture/
├── dictionary/
├── games/
├── challenges/
├── leaderboard/
├── adda/
├── comments/
├── reactions/
├── reports/
├── moderation/
├── businesses/
├── events/
├── creators/
├── notifications/
├── search/
├── analytics/
├── payments/
└── sponsorships/
```

Keep business logic out of React components.

## 9. Database Foundation

### users

```text
id
auth_provider_id
username
display_name
email
avatar_url
locale
language
account_type
created_at
updated_at
```

Do not collect unnecessary personal data.

### profiles

```text
user_id
bio
city_region
interests
privacy_level
created_at
updated_at
```

Avoid exact location.

### posts

```text
id
author_id
category_id
title
body
status
visibility
moderation_status
created_at
updated_at
```

### comments

```text
id
post_id
author_id
body
status
moderation_status
created_at
```

### reports

```text
id
reporter_id
target_type
target_id
reason
description
status
priority
created_at
resolved_at
resolved_by
```

### games

```text
id
slug
name_bn
name_en
type
status
```

### game_sessions

```text
id
game_id
user_id
score
duration_ms
metadata
created_at
```

### dictionary_words

```text
id
word
normalized_word
meaning_bn
meaning_en
pronunciation
part_of_speech
difficulty
frequency
valid_for_game
source
license
confidence
created_at
```

### content_sources

```text
id
source_name
source_url
license
rights_status
retrieved_at
notes
```

Every imported cultural/dictionary asset should have provenance.

## 10. Bengali Language Engine

This is a critical technical component.

Do not use raw JavaScript string length as the number of visible Bengali
letters.

Build:

```text
packages/bengali/
```

Functions:

```text
normalizeBengali()
tokenizeBengali()
graphemes()
normalizeForSearch()
normalizeForDictionary()
isValidBengaliWord()
```

Support:

- Unicode normalization
- grapheme clusters
- vowel signs
- conjuncts
- punctuation normalization
- zero-width character handling
- duplicate representation detection

ShobdoShakti should use game tokens/orthographic units, not raw Unicode
code points.

## 11. Dictionary and Data Licensing

Do not copy a commercial dictionary without permission.

Every source must be classified:

```text
PUBLIC_DOMAIN
OPEN_LICENSE
CREATIVE_COMMONS
COMMERCIAL_LICENSE
USER_SUBMITTED
INTERNAL
UNKNOWN
```

Do not import UNKNOWN data into production.

Every word/content record must be traceable to a source.

## 12. Copyright

The product must be designed so that users upload content only when they
have the rights or another lawful basis.

### Lower-risk examples

- user-created writing
- user-created photography
- user-created artwork
- user-created audio/video
- properly licensed content
- public-domain material
- appropriately licensed Creative Commons material
- permitted links/embeds

### High-risk examples

- full books
- full newspaper articles
- complete songs
- movie clips
- TV episodes
- pirated PDFs
- commercial photographs
- scanned magazines
- copyrighted illustrations

For uploaded media store:

```text
asset_id
uploader_id
asset_type
source
rights_type
copyright_owner
license
permission_reference
created_at
status
```

Build:

```text
/report-copyright
```

Flow:

```text
Claim
 ↓
Content ID
 ↓
Temporary restriction if appropriate
 ↓
Review
 ↓
Decision
 ↓
Notification
 ↓
Audit log
```

Maintain:

- Terms of Service
- Copyright Policy
- reporting process
- repeat-infringer process where legally appropriate
- moderation records

Exact notice-and-takedown requirements should be reviewed for each
target jurisdiction.

## 13. User Safety and Moderation

Theke Adda makes the product a user-to-user service.

Build from day one:

- report
- block
- mute
- moderation queue
- rate limits
- spam detection
- abuse detection
- audit logs
- account suspension
- appeals/review

Moderation pipeline:

```text
User submission
      |
      v
Basic validation
      |
      v
Spam / abuse checks
      |
      v
AI risk classification
      |
      +------ Low ------> Publish
      |
      +---- Medium -----> Human review
      |
      +----- High ------> Restrict / escalate
```

Do not rely entirely on AI.

## 14. Child Safety and Privacy

Games, learning and culture are likely to attract children.

The UK ICO Children's Code applies to online services likely to be
accessed by children, including apps and games. It promotes high privacy
by default, data minimisation, appropriate age application,
transparency, safeguards around location and profiling, and other
protections.

Ofcom's Online Safety Act guidance also requires in-scope services to
assess whether children are likely to access them and, where applicable,
perform children's risk assessments and implement appropriate
protections.

Official references:

- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/
- https://www.ofcom.org.uk/online-safety/
- https://www.ofcom.org.uk/online-safety/protecting-children/protection-of-children-duties-under-the-online-safety-act

Recommended initial model:

### Child-safe public area

Allow:

- games
- quizzes
- cultural content
- learning
- calendar
- badges

Do not initially provide children with:

- direct messaging
- public child profiles
- exact location
- unrestricted photo upload
- adult-to-child messaging
- open follower mechanics

### Adult/community area

Registered users may participate in Adda subject to appropriate safety
controls and moderation.

## 15. Privacy

Principles:

- minimum necessary data
- privacy by default
- no unnecessary location tracking
- no contacts access unless essential
- no address collection
- clear privacy notice
- retention policy
- deletion workflow
- account export/deletion workflow
- secure authentication
- access controls
- audit logs

## 16. Advertising Safety

- limited ad density
- clear sponsored labels
- no deceptive ads
- no disguised advertising
- no behavioural profiling of children
- contextual/brand-safe advertising for child-facing areas or no
  advertising
- advertiser approval process

## 17. Accessibility

Target WCAG 2.2 AA as a practical goal.

Include:

- keyboard navigation
- screen-reader labels
- contrast
- adjustable text
- reduced motion
- focus states
- accessible forms
- captions/transcripts
- Bengali/English toggle
- audio pronunciation where useful

## 18. SEO

Use:

- Next.js metadata
- sitemap
- robots.txt
- canonical URLs
- Open Graph
- structured data
- breadcrumbs
- event metadata

Important public routes:

```text
/today
/play
/play/shobdoshakti
/quiz
/calendar
/culture/:slug
/festivals/:slug
/learn/:slug
/theke-adda
/business
/events
```

## 19. Testing

### Unit

- Bengali normalization
- scoring
- dictionary validation
- moderation rules
- permissions
- date calculations

### Integration

- auth
- database
- game sessions
- posts
- comments
- reports
- copyright workflow

### E2E

Use Playwright for:

```text
Visitor → Homepage → Daily Game → Result
Visitor → Calendar → Festival
Visitor → Quiz → Result → Share
User → Login → Adda → Post → Comment → Report
User → Game → Score → Leaderboard
Moderator → Report → Review → Action
Business → Listing → Payment → Dashboard
```

## 20. CI/CD

```text
GitHub
  ↓
Pull Request
  ↓
Lint
  ↓
Type Check
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
Build
  ↓
Playwright E2E
  ↓
Security Checks
  ↓
Deploy
```

Recommended:

- GitHub Actions
- Playwright
- ESLint
- Prettier
- TypeScript
- Sentry
- dependency scanning

## 21. MVP

### Must have

Homepage / Today:

- Bengali date
- festival information
- countdown
- daily word
- daily challenge
- daily quiz

Play:

- daily Bengali challenge
- Bengali quiz
- simple word game
- leaderboard
- share result

Celebrate:

- Durga Puja hub
- Puja calendar
- Puja Passport
- daily Puja challenge

Learn:

- Bengali word/meaning
- basic language content

Theke Adda:

- curated threads
- comments
- reactions
- reporting
- moderation

Account:

- optional login
- saved score
- profile
- badges

Admin:

- content management
- moderation
- reports
- user management

### Not in MVP

- Facebook-like feed
- direct messaging
- native iOS/Android
- live video
- full creator marketplace
- full business marketplace
- advanced recommendations
- full multiplayer ShobdoShakti
- custom video hosting
- advanced AI assistant
- public exact-location profiles
- political advertising
- cryptocurrency

## 22. Product Metrics

### Acquisition

- visitors
- traffic source
- share clicks
- organic search

### Activation

- first game completed
- first quiz completed
- first Adda view
- first calendar interaction

### Retention

- D1
- D7
- D30
- repeat game players

### Engagement

- games/session
- quiz completion
- Adda comments
- shares
- Puja Passport completion

### Safety

- reports per 1,000 users
- moderation response time
- spam rate
- repeat offender rate
- copyright reports
- child-safety incidents

### Business

- sponsor leads
- business listings
- paid listings
- campaign revenue
- affiliate clicks

## 23. North Star Metric

Suggested north-star metric:

> Weekly Active Users completing at least one meaningful Bengali
> cultural interaction.

Examples:

- game
- quiz
- culture content
- calendar
- Adda
- learning activity

## 24. Sharodiya Roadmap

### Phase 0 --- Foundation

- repository
- architecture
- database
- auth
- design system
- CI/CD
- environments
- monitoring

### Phase 1 --- Today

- homepage
- Bengali date
- festival data
- daily word
- daily challenge

### Phase 2 --- Games

- quiz
- word challenge
- score
- leaderboard
- share card
- analytics

### Phase 3 --- Sharodiya

- Puja hub
- countdown
- Puja Passport
- daily challenge
- cultural content

### Phase 4 --- Theke Adda

- threads
- comments
- reactions
- reports
- moderation queue
- admin moderation

### Phase 5 --- Polish

- accessibility
- performance
- security
- SEO
- analytics
- mobile UX

## 25. Long-Term Roadmap

### Version 1

Sharodiya:

- Today
- Games
- Quiz
- Calendar
- Puja
- Theke Adda

### Version 2

Everyday Bengali:

- culture
- learning
- dictionary
- more games
- community

### Version 3

Bengali ecosystem:

- businesses
- events
- creators
- diaspora Puja
- teacher directory

### Version 4

Platform:

- Bengali API
- cultural knowledge graph
- creator marketplace
- business tools
- advanced search
- mobile apps

## 26. Claude Code Master Prompt

Use this prompt after placing this document in
`/docs/ALAPON_FIRST_DRAFT.md`:

```text
You are the principal engineer for the Alapon project.

Read /docs/ALAPON_FIRST_DRAFT.md completely before making implementation decisions.

Build Alapon as a production-quality Bengali-first digital culture platform.

Do not blindly implement every future feature in the document. Start with the MVP.

Architecture:
- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL/Supabase
- Redis
- Payload CMS
- Cloudflare/R2-compatible storage
- Playwright
- unit/integration testing
- Sentry
- PostHog

Use a modular monolith.

Priorities:
1. Bengali language correctness
2. security
3. privacy
4. child safety
5. accessibility
6. performance
7. maintainability
8. testability
9. clean UX

Before coding:
1. inspect the repository
2. create an architecture plan
3. identify dependencies
4. create an implementation checklist
5. create a database schema plan
6. identify compliance-sensitive features
7. ask only questions that block implementation

Do not:
- create unnecessary microservices
- add unnecessary dependencies
- hard-code content
- expose secrets
- store unnecessary personal data
- treat Bengali characters as simple code points
- implement unrestricted social messaging
- add unapproved MVP features

Every feature must have:
- domain logic
- API validation
- permissions
- loading/error/empty states
- tests
- accessibility considerations
- analytics definition
- security consideration

For Bengali:
- implement Unicode-aware normalization
- implement grapheme-aware processing
- create reusable Bengali utilities
- separate game tokenisation from visual rendering
- maintain dictionary provenance

For community:
- every UGC object must support moderation status
- build report/block/mute capability
- build moderation audit logs
- do not rely solely on AI moderation

For copyright:
- store source/license/rights metadata
- build reporting capability
- do not import unknown copyrighted datasets
- require human/legal review for uncertain rights

For children:
- default to privacy-preserving design
- avoid unnecessary data collection
- do not create adult-to-child messaging
- keep child-safe experiences separated from unrestricted community features
- document decisions in /docs/compliance/

Development approach:
- small incremental commits
- keep the application runnable after each major step
- write tests with core functionality
- update documentation when architecture changes
- use feature flags for unfinished functionality

First task:
Do not immediately build everything.

First inspect the repository and produce:
1. proposed architecture
2. folder structure
3. dependency list
4. database schema
5. MVP implementation plan
6. risks/blockers
7. first sprint plan

Then begin implementation of the foundation.
```

## 27. Decision Log

Decision Status

---

Bengali-first Approved
English support Approved
Free core experience Approved
Subscription-first model Rejected
Facebook clone Rejected
Modular monolith Approved
Next.js Approved
TypeScript Approved
PostgreSQL Approved
Redis Approved
PWA before native apps Approved
ShobdoShakti as long-term flagship game Approved
Theke Adda Approved
Sharodiya 1433 MVP Approved
Child safety by design Mandatory
Copyright provenance Mandatory
AI-only moderation Rejected
Unrestricted DM at launch Rejected
Microservices at launch Rejected

## 28. Final Principle

Alapon should be a **cultural platform first, social platform second**.

Games bring people in.

Daily Bengali gives them a reason to return.

Culture gives them something meaningful to discover.

Theke Adda gives them somewhere to talk.

Festivals create seasonal spikes.

Businesses and brands create revenue.

The Bengali language/data layer creates the long-term technical moat.

**Build the daily habit first. Build the ecosystem second.**
