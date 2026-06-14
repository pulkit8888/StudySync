# TODO - StudySync UI actions for Search cards

## Implementation steps

- [ ] Remove all non-Delete actions from Search card menus.
  - [ ] Update `src/routes/search-actions.tsx` to keep ONLY Delete for Highlight/Summary/Note.
- [ ] Fix overlapping Search card UI by removing/altering absolute rightAction placement.
  - [ ] Update `src/routes/search.tsx` (`ResultCard`) to place delete button in-flow on the right.
- [ ] Update store delete logic to also update localStorage and cascade removals.
  - [ ] Update `src/lib/store.ts`
    - [ ] `deleteHighlight` removes related bookmarks from localStorage.
    - [ ] `deleteSummary` removes related saved summaries from localStorage.
    - [ ] `deleteTopic` removes related highlights/summaries/notes + bookmarks/saved summaries.
    - [ ] `deleteSource` removes related highlights/summaries + bookmarks/saved summaries.
- [ ] Add Delete buttons for Topic and Source items in Search results.
  - [ ] Update `src/routes/search.tsx` to render delete controls for Topic and Source search results.
- [ ] Run typecheck/build.
- [ ] Manual verification:
  - [ ] No overlap in Search cards.
  - [ ] Only trash delete actions appear for Highlights/Summaries/Notes.
  - [ ] Topic delete removes topic + all related entities incl. bookmarks/saved summaries.
  - [ ] Source delete removes related entities incl. bookmarks/saved summaries.
