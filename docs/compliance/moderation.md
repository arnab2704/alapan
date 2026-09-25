# Moderation

- **Report:** any post or comment (`reports`; reasons spam/abuse/hate/unsafe/copyright/other; `unsafe` is high priority).
- **Block / mute:** per user (`blocks.muted_only`); hidden content is filtered by `is_hidden_from_me()`. Buttons on every post and comment.
- **Queue:** `/moderation` for moderators and admins. Actions remove content or dismiss the report, and every action calls `log_moderation_action` -> `moderation_audit_log` (moderators can read it; nobody can edit it).
- **Suspension:** moderators can suspend a user for N days; suspended users cannot post (`can_participate()`).
- **Appeals:** account page -> `appeals`; reviewed in `/admin` (uphold / overturn) and logged.
- **Rate limits:** database triggers (migration 0003) limit post and comment frequency.
- **Automation:** none is authoritative. Add spam or abuse scoring only as a triage signal (low -> publish, medium -> human review, high -> restrict and escalate); never let AI alone remove content or suspend accounts.
- **Roles:** `profiles.role` is user, moderator or admin. Promote via SQL by the operator; there is no self-service.
