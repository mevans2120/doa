# CMS Management Guide

This guide covers how to manage content for the Department of Art website using Sanity Studio.

## Accessing Sanity Studio

### Local Development
- URL: `http://localhost:3000/studio`
- Must have development server running

### Production
- URL: `https://your-domain.com/studio`
- Requires Sanity account with appropriate permissions

### Login
1. Navigate to Studio URL
2. Click "Login" 
3. Use Google, GitHub, or email authentication
4. Must be invited to the project by an admin

## Content Types Overview

The Department of Art website has the following content types:

### 1. Projects
Showcase of completed work and portfolio pieces.

**Fields:**
- **Title** (required): Project name
- **Slug** (required): URL-friendly version of title
- **Main Image** (required): Hero image for project
- **Images**: Gallery of project photos
- **Description**: Brief project overview
- **Client**: Associated client
- **Category**: Type of project
- **Featured**: Show on homepage
- **Order**: Display order (lower numbers appear first)

### 2. Services
Services offered by Department of Art.

**Fields:**
- **Title** (required): Service name
- **Short Description** (required): Brief overview (shown on cards)
- **Full Description**: Detailed service information
- **Icon Type**: Icon to display with service
- **Featured**: Show on homepage
- **Order**: Display order

### 3. Clients
Client companies and organizations.

**Fields:**
- **Name** (required): Client company name
- **Logo** (required): Company logo (PNG/SVG preferred)
- **Website**: Client website URL
- **Featured**: Show on homepage
- **Order**: Display order

### 4. Testimonials
Client feedback and reviews.

**Fields:**
- **Quote** (required): The testimonial text
- **Author** (required): Person's name
- **Role**: Job title
- **Company**: Company name
- **Featured**: Show on homepage

### 5. Team Members
Staff and crew information.

**Fields:**
- **Name** (required): Full name
- **Role** (required): Job title
- **Bio**: Biography text
- **Photo**: Profile photo
- **IMDB URL**: Link to IMDB profile

### 6. Site Settings (Singleton)
Global site configuration.

**Fields:**
- **Title**: Site title
- **SEO**: Meta tags and social sharing
- **Footer**: Footer content and links
- **Navigation**: Menu labels
- **Contact**: Email and phone numbers
- **Address**: Physical location

### 7. Homepage Settings (Singleton)
Homepage-specific configuration.

**Fields:**
- **Hero Title**: Main headline
- **Hero Subtitle**: Subheading
- **Section Titles**: Customize section headings

### 8. About Page (Singleton)
About page content.

**Fields:**
- **Title**: Page title
- **Company Overview**: Rich text content
- **Mission & Vision**: Company values
- **Story**: Company history
- **Team Section Title**: Header for team section

## Common Tasks

### Creating New Content

1. **Navigate to Content Type**
   - Click on the content type in the left sidebar
   - Click "+" or "Create new" button

2. **Fill Required Fields**
   - Fields marked with * are required
   - Red indicators show validation errors

3. **Add Media**
   - Click "Upload" or drag & drop images
   - Recommended image sizes:
     - Project images: 1920x1080px
     - Client logos: 400x200px (PNG with transparency)
     - Team photos: 800x800px

4. **Set SEO Fields** (if available)
   - Meta title: 50-60 characters
   - Meta description: 150-160 characters

5. **Publish**
   - Click "Publish" button
   - Changes are live immediately

### Editing Existing Content

1. **Find Content**
   - Use search bar at top
   - Or browse content type list

2. **Make Changes**
   - Click on item to edit
   - Modify fields as needed

3. **Save Changes**
   - Click "Publish" to make live
   - Or "Save draft" to save without publishing

### Managing Images

#### Image Requirements
- **Format**: JPG, PNG, WebP, SVG (for logos)
- **Size**: Max 5MB per image
- **Dimensions**: 
  - Hero images: 1920x1080px minimum
  - Thumbnails: 800x600px minimum
  - Logos: SVG preferred, or PNG with transparency

#### Image Optimization
- Images are automatically optimized
- Multiple sizes generated for responsive display
- Use descriptive alt text for accessibility

### Ordering Content

1. **Using Order Field**
   - Lower numbers appear first
   - Use increments of 10 (10, 20, 30) for easy reordering

2. **Featured Content**
   - Toggle "Featured" to show on homepage
   - Featured items respect order field

### Rich Text Editing

For fields with rich text editor:

#### Formatting Options
- **Bold**: Cmd/Ctrl + B
- **Italic**: Cmd/Ctrl + I
- **Headings**: Use dropdown or ## for H2, ### for H3
- **Lists**: Use toolbar or - for bullets, 1. for numbers
- **Links**: Select text and click link icon

#### Best Practices
- Use headings for structure (H2, H3)
- Keep paragraphs short (3-4 sentences)
- Use lists for easy scanning
- Add links to relevant content

## SEO Best Practices

### Page Titles
- Include relevant keywords
- Keep under 60 characters
- Make unique for each page
- Format: "Page Title | Department of Art"

### Meta Descriptions
- Summarize page content
- Include call-to-action
- Keep under 160 characters
- Use relevant keywords naturally

### Image Alt Text
- Describe image content
- Include relevant keywords
- Keep concise but descriptive
- Important for accessibility

### URL Slugs
- Use lowercase letters
- Separate words with hyphens
- Keep short and descriptive
- Avoid special characters

## Content Guidelines

### Writing Style
- **Tone**: Professional but approachable
- **Voice**: Active, confident
- **Length**: Concise, scannable
- **Keywords**: Natural placement

### Project Descriptions
- Start with project type/industry
- Highlight unique challenges
- Mention specific techniques used
- Include measurable results if available

### Service Descriptions
- Lead with benefits
- Use bullet points for features
- Include specific examples
- End with call-to-action

## Troubleshooting

### Content Not Appearing
1. Check if content is published
2. Verify "Featured" toggle if expecting on homepage
3. Clear browser cache
4. Wait 1-2 minutes for CDN update

### Images Not Loading
1. Check file size (max 5MB)
2. Verify image format is supported
3. Try re-uploading image
4. Check internet connection

### Can't Login to Studio
1. Verify you have an account
2. Check you're invited to project
3. Try different browser
4. Clear cookies and cache

### Validation Errors
1. Check all required fields are filled
2. Verify slug is unique
3. Ensure image dimensions meet requirements
4. Check character limits on text fields

## Workflow Tips

### Batch Updates
1. Prepare all content offline first
2. Gather all images in advance
3. Update related content together
4. Review on staging before publishing

### Content Planning
1. Create content calendar
2. Maintain consistent posting schedule
3. Plan seasonal content in advance
4. Coordinate with marketing campaigns

### Quality Checklist
Before publishing:
- [ ] Spell check all text
- [ ] Verify all links work
- [ ] Check image quality
- [ ] Review on mobile preview
- [ ] Confirm SEO fields completed

## Getting Help

### Documentation
- [Sanity Documentation](https://www.sanity.io/docs)
- [Rich Text Guide](https://www.sanity.io/docs/block-content)

### Support
- Technical issues: Contact development team
- Content questions: Refer to brand guidelines
- Training needs: Schedule with admin

## Advanced Features

### Scheduling Content
Currently not available - consider for future implementation

### Content Versioning
- Sanity maintains history of all changes
- Contact developer to restore previous versions

### Bulk Operations
- For bulk updates, contact development team
- CSV import/export available for large datasets

---

Last Updated: December 2024
Version: 1.0.0