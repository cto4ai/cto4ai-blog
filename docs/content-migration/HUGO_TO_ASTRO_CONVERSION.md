# Hugo to Astro Content Conversion Guide

This document outlines the complete process for converting Hugo blog posts to Astro MDX format while preserving enhanced image capabilities and maintaining consistent functionality.

## Overview

The conversion process transforms Hugo page bundles (with TOML frontmatter and Hugo shortcodes) into Astro MDX posts with YAML frontmatter and Astro components. Key goals:

- **Preserve enhanced image functionality**: Click-to-zoom, responsive sizing, modern optimization
- **Maintain consistent component usage**: SingleImage for individual images, ImageGallery for multiple images  
- **Enable dynamic asset loading**: Images load from organized directory structure
- **Support lightbox functionality**: GLightbox integration for all images

## Content Conversion Patterns

### 1. Frontmatter Conversion

**Hugo (TOML):**
```toml
+++
title = "AI Engineer World's Fair 2025: My Day 1 Highlights"
description = "Key takeaways and observations from Day 1"
author = "Jack Ivers"
date = 2025-06-18T16:36:00-04:00
draft = false
categories = ["AI", "Technology"]
tags = ["AIEWF2025", "conference", "AI engineering"]
ShowToc = false

[cover]
cover = true
image = "cover2.webp"
alt = "AI Engineer World's Fair 2025"
relative = true 
+++
```

**Astro MDX (YAML):**
```yaml
---
title: "AI Engineer World's Fair 2025: My Day 1 Highlights"
description: "Key takeaways and observations from Day 1"
author: "Jack Ivers"
publishDate: "2025-06-18T16:36:00-04:00"
draft: false
categories: ['AI', 'Technology']
tags: ['AIEWF2025', 'conference', 'AI engineering']
image: "~/assets/images/posts/blog/cover2.webp"
---
```

**Key Changes:**
- `+++` delimiters → `---` delimiters
- `date` → `publishDate`
- TOML arrays `["item"]` → YAML arrays `['item']`
- Cover image → Direct image path reference

### 2. Image Shortcode Conversion

#### Single Images

**Hugo Shortcode:**
```hugo
{{< imgs kind="page" size="2xl" imgs="swyx_day1.png" >}}
```

**Astro Component:**
```astro
<SingleImage src="swyx_day1.png" alt="Swyx Day1" size="2xl" postDir="aiewf2025-my-day-1-highlights" />
```

#### Image Galleries (Multiple Images)

**Hugo Shortcode:**
```hugo
{{< imgs kind="page" size="xl" imgs="barth_streams_agents.png,barth_streams_agents_mcp.png" >}}
```

**Astro Component:**
```astro
<ImageGallery images={['barth_streams_agents.png', 'barth_streams_agents_mcp.png']} alt="Gallery of 2 images" size="xl" postDir="aiewf2025-my-day-1-highlights" />
```

#### Special Content

**Video Content:**
```hugo
{{< rawhtml >}}
<video controls width="100%" preload="metadata" loop class="html-video">
  <source src="hykes_demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
{{< /rawhtml >}}
```

Converts to standard HTML (rawhtml wrapper removed).

### 3. Component Import Requirements

**Required Imports at Top of MDX:**
```astro
import SingleImage from '~/components/ui/SingleImage.astro';
import ImageGallery from '~/components/ui/ImageGallery.astro';
```

## Component Usage Guidelines

### SingleImage Component

**Purpose:** Individual images with enhanced capabilities
- Click-to-zoom lightbox functionality
- Responsive sizing with semantic size classes
- Dynamic image loading with optimization
- Automatic alt text generation from filename

**Parameters:**
- `src`: Image filename (string)
- `alt`: Alt text (string, auto-generated from filename if not provided)
- `size`: Size class (string: "sm", "md", "lg", "xl", "2xl", etc.)
- `postDir`: Post directory for asset location (string)

**Example Usage:**
```astro
<SingleImage 
  src="presentation_slide.png" 
  alt="Key presentation slide showing AI trends" 
  size="lg" 
  postDir="ai-conference-2025" 
/>
```

### ImageGallery Component

**Purpose:** Multiple related images displayed as a gallery
- Grid layout with consistent spacing
- All images get lightbox functionality
- Semantic usage for grouped content

**Parameters:**
- `images`: Array of image filenames (array of strings)
- `alt`: Gallery description (string)
- `size`: Size class for all images (string)
- `postDir`: Post directory for asset location (string)

**Example Usage:**
```astro
<ImageGallery 
  images={['demo_1.png', 'demo_2.png', 'demo_3.png']} 
  alt="Product demo screenshot gallery" 
  size="md" 
  postDir="product-launch-2025" 
/>
```

### Size Classes

**Available sizes:**
- `sm`: Small images (thumbnails, icons)
- `md`: Medium images (standard content)
- `lg`: Large images (emphasis, detailed views)
- `xl`: Extra large (key visuals, hero images)
- `2xl`: Maximum size (full-width showcase)
- `lg+`, `lg++`, `lg+++`: Fine-tuned intermediate sizes

**Semantic Usage:**
- `2xl`: Main presentation slides, key visual content
- `xl`: Important diagrams, architecture overviews  
- `lg`: Standard screenshots, detailed images
- `md`: Supporting visuals, profile photos
- `sm`: Icons, small supporting elements

## Directory Structure

### Hugo Structure (Source)
```
content/blog/post-name/
├── index.md                 # Post content with TOML frontmatter
├── image1.png              # Image assets
├── image2.webp             # Video assets
├── demo.mp4                # Various media files
└── socialposts/            # Social media assets (ignored)
    └── images/
```

### Astro Structure (Target)
```
src/
├── data/posts/
│   └── post-name.mdx       # Converted post with YAML frontmatter
└── assets/images/blog/
    └── post-name/          # Migrated image assets
        ├── image1.png
        ├── image2.webp
        └── demo.mp4
```

## Conversion Tools

### 1. Complete Conversion Tool

**Purpose:** Convert entire Hugo posts from scratch
**Usage:**
```bash
python3 complete-conversion.py /path/to/hugo/post target-post-name
```

**What it does:**
- Converts TOML frontmatter to YAML
- Converts all Hugo shortcodes to Astro components
- Copies all image/video assets to correct directory
- Adds necessary component imports
- Creates clean, ready-to-use MDX file

### 2. Enhanced Patch Tool

**Purpose:** Convert existing MDX files with mixed approaches
**Usage:**
```bash
python3 patch-existing-mdx.py existing-file.mdx /path/to/hugo/source post-dir
```

**Auto-detection capabilities:**
- **Static imports + Image components**: Replaces `<Image src={var}>` with `<SingleImage>`
- **Empty line patterns**: Replaces placeholder empty lines with components
- **Mixed scenarios**: Handles any combination of approaches

**What it does:**
- Detects existing file structure automatically
- Chooses appropriate conversion strategy
- Replaces existing components with enhanced versions
- Removes unused static imports
- Adds necessary component imports

### 3. Basic Shortcode Converter

**Purpose:** Simple shortcode-only conversion
**Usage:**
```bash
python3 convert-hugo-shortcodes.py file.mdx --post-dir post-name
```

## Asset Migration Process

### 1. Asset Discovery
- Locate Hugo page bundle directory
- Identify all media files (images, videos)
- Exclude social media directories and non-content files

### 2. Asset Organization
- Create target directory: `src/assets/images/blog/post-name/`
- Copy all media assets preserving filenames
- Maintain relative relationships between content and assets

### 3. Dynamic Loading Setup
- Components use `postDir` parameter for asset location
- Dynamic imports handle asset optimization
- Vite processes all assets through optimization pipeline

## Quality Assurance Checklist

### Post Conversion Verification

- [ ] **Frontmatter converted**: TOML → YAML format
- [ ] **All shortcodes converted**: No `{{< >}}` patterns remain
- [ ] **Component imports added**: SingleImage and ImageGallery imports present
- [ ] **Assets migrated**: All images/videos copied to correct directory
- [ ] **Semantic component usage**: Single images use SingleImage, multiple use ImageGallery
- [ ] **Size classes appropriate**: Consistent with content hierarchy
- [ ] **Alt text meaningful**: Descriptive text for accessibility

### Functional Testing

- [ ] **Images display correctly**: All images load without errors
- [ ] **Lightbox functionality**: Click-to-zoom works on all images
- [ ] **Responsive behavior**: Images scale appropriately on different screen sizes
- [ ] **Gallery behavior**: Multiple images display in grid layout
- [ ] **Performance**: No console errors, assets load efficiently

## Troubleshooting

### Common Issues

**Images not displaying:**
- Check `postDir` parameter matches actual directory name
- Verify assets copied to `src/assets/images/blog/post-name/`
- Confirm filenames match exactly (case-sensitive)

**Vite dynamic import warnings:**
- These are expected and don't affect functionality
- Warnings occur because Vite can't analyze dynamic import paths at build time

**Mixed conversion results:**
- Use enhanced patch tool for files with existing static imports
- Let auto-detection choose appropriate strategy
- Manual cleanup may be needed for complex edge cases

**Gallery vs single image decisions:**
- Single image: One image in Hugo shortcode → SingleImage
- Gallery: Multiple images (comma-separated) → ImageGallery  
- Semantic consideration: Related images should use gallery even if converted separately

## Best Practices

### Content Strategy
- **Preserve Hugo enhancements**: Maintain click-to-zoom and responsive capabilities
- **Consistent component usage**: Don't mix different image approaches in same post
- **Semantic sizing**: Use size classes that match content hierarchy
- **Gallery grouping**: Group related images into galleries rather than separate singles

### Technical Implementation
- **Use automation tools**: Don't convert shortcodes manually
- **Verify asset paths**: Always test image loading after conversion
- **Clean imports**: Remove unused static imports after component conversion
- **Test functionality**: Verify lightbox and responsive behavior

### Workflow Efficiency
- **Start with complete conversion**: For new post migrations
- **Use patch tool for existing**: When posts already partially converted
- **Batch similar posts**: Process posts with similar structures together
- **Document custom patterns**: Note any non-standard conversions for future reference

## Example Conversion Flow

### 1. Identify Hugo Post
```
/Users/path/hugo/content/blog/ai-conference-2025/
├── index.md (TOML + Hugo shortcodes)
├── speaker1.png
├── presentation.webp
└── demo.mp4
```

### 2. Run Complete Conversion
```bash
python3 complete-conversion.py /Users/path/hugo/content/blog/ai-conference-2025 ai-conference-2025
```

### 3. Verify Results
```
src/data/posts/ai-conference-2025.mdx (YAML + Astro components)
src/assets/images/blog/ai-conference-2025/
├── speaker1.png
├── presentation.webp  
└── demo.mp4
```

### 4. Test Functionality
- Load post in development server
- Verify all images display
- Test lightbox functionality
- Check responsive behavior

This process ensures consistent, high-quality conversions that preserve Hugo's enhanced capabilities while leveraging Astro's modern architecture.