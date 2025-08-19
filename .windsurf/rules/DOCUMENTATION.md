# About Me - Project Documentation

## Project Purpose

"About Me" is a dynamic CV/portfolio website built with Astro. The project serves as a personal website that showcases professional information including:

- Personal details and contact information
- Professional experience
- Education history
- Skills and competencies
- Projects portfolio

The site is designed to be both a web portfolio and a printable CV, with specific styling for print media to create a clean, professional resume output.

## Technologies Used

### Core Technologies

- **[Astro](https://astro.build/)** (v5.13.2): A modern static site builder that delivers lightning-fast performance by shipping minimal JavaScript.
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.12): A utility-first CSS framework for rapidly building custom user interfaces.
- **[Astro DB](https://docs.astro.build/en/guides/integrations-guide/db/)**: Astro's built-in database solution for storing and retrieving data.

### Development Tools

- **PNPM**: Package manager used for dependency management.
- **Prettier**: Code formatter with plugins for Astro and Tailwind CSS.

## Architecture

The project follows Astro's component-based architecture:

- **Layouts**: Define the overall structure of the page.
- **Components**: Reusable UI elements organized by sections.
- **Pages**: Entry points for different routes in the application.
- **Styles**: Global CSS and Tailwind configuration.
- **DB**: Database files for storing personal information, experience, projects, etc.

## Style Guidelines

### CSS Approach

The project uses Tailwind CSS with custom theming:

- **Color Scheme**: Defined through CSS variables in `global.css` with support for both light and dark modes.
- **Responsive Design**: Mobile-first approach with specific breakpoints for different device sizes.
- **Print Styling**: Special styles for print media to create a clean, professional CV output.

### Design Principles

- **Clean and Modern UI**: Minimalist design with focus on content.
- **Accessibility**: Proper semantic HTML and color contrast.
- **Responsive**: Works well on all device sizes.
- **Dark Mode Support**: Automatically switches based on system preferences.

## Component Structure

The website is organized into distinct sections:

- **Hero**: Main introduction with profile picture and contact information.
- **About**: Brief personal bio and introduction.
- **Experience**: Work history and professional experience.
- **Education**: Academic background and qualifications.
- **Projects**: Portfolio of completed projects.
- **Skills**: Technical and professional competencies.

## Environment Variables

- `SHOW_PERSONAL`: Controls the display of personal contact information.

## Database Structure

The project uses Astro DB with the following tables:

- `users`: Basic user information.
- `personal_info`: Detailed personal information including title, description, etc.
- `experience`: Work history entries.
- `projects`: Portfolio project entries.

## Build and Deployment

- Development server runs on port 4321.
- Production builds are created in the `./dist/` directory.
- The project supports remote builds with the `--remote` flag.

## Best Practices for Contributing

1. **Component Organization**: Keep components focused and single-purpose.
2. **CSS Classes**: Use Tailwind utility classes and follow the established naming conventions.
3. **Responsive Design**: Always test changes across different device sizes.
4. **Accessibility**: Maintain proper semantic HTML and ensure good accessibility practices.
5. **Print Styling**: Remember to test how changes affect the print version of the CV.

## Performance Considerations

- Astro's partial hydration ensures minimal JavaScript is sent to the client.
- Images should be optimized using Astro's built-in Image component.
- External fonts are preloaded for better performance.

## Future Enhancements

Potential areas for improvement:

- Add internationalization support for multiple languages.
- Implement theme switcher for manual light/dark mode selection.
- Add animations for a more engaging user experience.
- Expand the database schema for more detailed project information.
