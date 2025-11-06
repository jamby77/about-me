# Improve and expand about-me project

This is an Astro-based portfolio/CV builder. 
It provides an admin UI to manage your profile, experience, projects, and skills, 
then renders a polished, shareable site. 
The roadmap includes richer editing, async form submissions, image uploads, feature flags, 
and the ability to export a single self-contained HTML file with all assets inlined.

## Admin side
- [ ] Change edit screen to be tabbed interface, each section should be a tab
- [ ] Add edit ability, each entry should be editable
- [ ] Add progressive enhancement, instead of plain html form, add async http submission
- [ ] Add image file upload for user image
- [ ] Add image file upload for projects
- [ ] Add feature flags system, image upload should be behind a feature flag
- [ ] Add template option, user should be able to choose from different templates for the resulting CV

## Client side
- [ ] Find a way to generate single html page with all the css and assets inlined
  - images should be inlined as base64 encoded strings
  - css should be inlined as a style tag
  - js should be inlined as a script tag, but kept to bare minimum
