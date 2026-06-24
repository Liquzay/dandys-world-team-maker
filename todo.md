# Dandy's World Team Maker - TODO

## Core Features (Completed)
- [x] Complete library of 40 Toons and 78 Trinkets
- [x] Advanced team building logic (multiplier support, 2-trinket limit per Toon, Toon renaming)
- [x] AI-powered team generator using Gemini 2.0 Flash
- [x] Account system with Roblox username integration and private server links
- [x] Community features: public run sharing, community browser, layout saving/loading
- [x] Custom content: Users can create and delete their own custom Toons and Trinkets
- [x] SEO optimization: Meta tags, robots.txt, sitemap, Google verification
- [x] Delete buttons in selection pickers for custom Toons and Trinkets
- [x] Visual indicators (✨ Custom label) for custom items
- [x] Implement 'Share to Community' button on main page to allow users to easily publish their current team
- [x] Fixed custom trinkets display with delete buttons in trinket picker
- [x] Added delete custom items modal in hamburger menu

## Planned Improvements
- [x] Add search and filtering/sorting to Community browser (newest, most liked)
- [x] Add hover tooltips or detail panel showing specific in-game effects and stats for each Trinket
- [ ] Add team statistics/analysis (total power, synergy, balance)
- [ ] Add team export/import functionality (JSON format)
- [ ] Add team history/undo functionality
- [ ] Add keyboard shortcuts for common actions
- [ ] Add dark/light theme toggle
- [ ] Add mobile-optimized layout improvements
- [ ] Add notification system for community interactions
- [ ] Add user profile customization (avatar, bio, favorite teams)
- [ ] Add team templates/presets for new users
- [ ] Add analytics tracking for popular Toons/Trinkets
- [ ] Add admin dashboard for content moderation

## Bug Fixes
- [x] Fix delete scoping bug in `server/db.ts` for custom items
- [ ] Test custom item deletion edge cases
- [ ] Verify trinket search works correctly with custom items
- [ ] Test community sharing with special characters in team names

## Testing & QA
- [ ] Write vitest tests for custom Toon/Trinket mutations
- [ ] Write vitest tests for delete operations
- [ ] Write vitest tests for community.create mutation
- [ ] Test AI team generation with various prompts
- [ ] Test community sharing and retrieval
- [ ] Test account creation and profile management
- [ ] Performance testing with large team lists
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
