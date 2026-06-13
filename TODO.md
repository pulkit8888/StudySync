# STUDY SYNC - TODO

- [x] Implement Dashboard → Topics delete button functionality with full cascading deletion and UI updates.

- [ ] Reuse existing store deleteTopic logic; ensure it removes topic + highlights + summaries + notes + sources (embedded) + bookmarks (if separate) + stats.
- [ ] Add confirmation dialog wording: “Delete topic 'DBMS'?” + explanation of removed entities.
- [ ] If the deleted topic is currently selected, switch dashboard view to "All Topics".
- [ ] Provide success/error toasts (or inline error UI if no toast system exists).
- [ ] Verify TypeScript build/lint.
