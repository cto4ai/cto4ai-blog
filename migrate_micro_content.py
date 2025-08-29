#!/usr/bin/env python3
"""
Hybrid Micro Content Migration Script for Hugo → Astro

SAFETY FEATURES:
- Outputs to /tmp/micro-migration/ (never overwrites existing files)
- Processes in small batches for manual review
- Preserves original files completely unchanged
- Supports rollback via git branching

Content Types Supported:
- micro: Simple micro blog posts
- elsewhere: Curated external content links
- quote: Quotes with attribution and permalink shortcodes  
- imagery: Visual content posts with image links

Usage:
    python3 migrate_micro_content.py <content_type> [--batch-size=5] [--start-index=0]
    
Examples:
    python3 migrate_micro_content.py micro --batch-size=5
    python3 migrate_micro_content.py elsewhere --start-index=10
    python3 migrate_micro_content.py quote
"""

import os
import shutil
import re
import sys
from pathlib import Path
from datetime import datetime
import argparse

# Paths
HUGO_CONTENT_DIR = Path("/Users/jackivers/Projects/hugo/craftycto/content")
ASTRO_ASSETS_DIR = Path("/Users/jackivers/Projects/cto4ai-blog/src/assets/images")
TEMP_OUTPUT_DIR = Path("/tmp/micro-migration")

def ensure_temp_directories():
    """Create temp directories for safe output"""
    for content_type in ['micro', 'elsewhere', 'quote', 'imagery']:
        (TEMP_OUTPUT_DIR / content_type).mkdir(parents=True, exist_ok=True)
    print(f"✅ Created temp directories in {TEMP_OUTPUT_DIR}")

def parse_hugo_frontmatter(content):
    """Parse Hugo TOML frontmatter into Python dict"""
    frontmatter = {}
    lines = content.split('\n')
    in_frontmatter = False
    content_start = 0
    
    for i, line in enumerate(lines):
        if line.strip() == '+++':
            if not in_frontmatter:
                in_frontmatter = True
                continue
            else:
                content_start = i + 1
                break
        
        if in_frontmatter and line.strip():
            # Simple TOML parsing for key = value pairs
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                # Clean up quotes and convert types
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.lower() == 'true':
                    value = True
                elif value.lower() == 'false':
                    value = False
                elif value.startswith('[') and value.endswith(']'):
                    # Handle arrays like categories = ["CTO","Crafty CTO"]
                    value = [v.strip().strip('"') for v in value[1:-1].split(',') if v.strip()]
                
                frontmatter[key] = value
    
    post_content = '\n'.join(lines[content_start:]).strip()
    return frontmatter, post_content

def convert_to_astro_frontmatter(frontmatter, content_type):
    """Convert Hugo frontmatter to Astro YAML format"""
    astro_fm = {}
    
    # Required Astro fields
    if 'title' in frontmatter:
        astro_fm['title'] = frontmatter['title']
    if 'description' in frontmatter:
        astro_fm['description'] = frontmatter['description']
    if 'author' in frontmatter:
        astro_fm['author'] = frontmatter['author']
    
    # Date handling
    if 'date' in frontmatter:
        date_val = frontmatter['date']
        if isinstance(date_val, str):
            # Convert Hugo date format to Astro publishDate
            try:
                if 'T' in date_val:
                    astro_fm['publishDate'] = date_val
                else:
                    # Add time if missing
                    astro_fm['publishDate'] = f"{date_val}T00:00:00-05:00"
            except:
                astro_fm['publishDate'] = date_val
    
    # Draft status
    astro_fm['draft'] = frontmatter.get('draft', False)
    
    # Content type specific fields
    if content_type == 'elsewhere' and 'sourceLink' in frontmatter:
        astro_fm['sourceLink'] = frontmatter['sourceLink']
    
    if content_type == 'quote' and 'sourceLink' in frontmatter:
        astro_fm['sourceLink'] = frontmatter['sourceLink']
    
    if content_type == 'imagery':
        if 'imageLink' in frontmatter:
            astro_fm['imageLink'] = frontmatter['imageLink']
        if 'sourceLink' in frontmatter:
            astro_fm['sourceLink'] = frontmatter['sourceLink']
        if 'sourceText' in frontmatter:
            astro_fm['sourceText'] = frontmatter['sourceText']
    
    # Categories and tags
    if 'categories' in frontmatter:
        astro_fm['categories'] = frontmatter['categories']
    if 'tags' in frontmatter:
        astro_fm['tags'] = frontmatter['tags']
    
    return astro_fm

def convert_hugo_shortcodes(content, post_slug):
    """Convert Hugo shortcodes to Astro components"""
    imports = []
    
    # Convert {{< permalink >}} to Astro component
    if re.search(r'\{\{<\s*permalink\s*>\}\}', content):
        content = re.sub(r'\{\{<\s*permalink\s*>\}\}', '<PermalinkComponent />', content)
        imports.append("import PermalinkComponent from '~/components/ui/PermalinkComponent.astro';")
    
    # Convert {{< imgs >}} shortcode to SingleImage component
    imgs_pattern = r'\{\{<\s*imgs\s+kind="[^"]*"\s+size="([^"]*)"\s+imgs="([^"]*)"[^>]*>\}\}'
    imgs_matches = re.findall(imgs_pattern, content)
    
    if imgs_matches:
        imports.append("import SingleImage from '~/components/ui/SingleImage.astro';")
        
        for size, img_filename in imgs_matches:
            # Convert Hugo imgs shortcode to Astro SingleImage
            old_shortcode = re.search(f'\\{{\\{{<\\s*imgs\\s+[^>]*imgs="{img_filename}"[^>]*>\\}}\\}}', content).group(0)
            new_component = f'<SingleImage src="{img_filename}" alt="{img_filename}" size="{size}" postDir="{post_slug}" />'
            content = content.replace(old_shortcode, new_component)
    
    # Add imports to the beginning if any were needed
    if imports:
        import_lines = '\n'.join(imports)
        content = f"{import_lines}\n\n{content}"
    
    return content

def format_astro_frontmatter(frontmatter):
    """Format frontmatter as Astro YAML"""
    yaml_lines = ['---']
    
    for key, value in frontmatter.items():
        if isinstance(value, str):
            # Escape quotes in strings
            escaped_value = value.replace('"', '\\"')
            yaml_lines.append(f'{key}: "{escaped_value}"')
        elif isinstance(value, bool):
            yaml_lines.append(f'{key}: {str(value).lower()}')
        elif isinstance(value, list):
            quoted_items = [f'"{item}"' for item in value]
            yaml_lines.append(f'{key}: [{", ".join(quoted_items)}]')
        else:
            yaml_lines.append(f'{key}: {value}')
    
    yaml_lines.append('---')
    return '\n'.join(yaml_lines)

def process_content_file(hugo_file, content_type, output_dir):
    """Process a single Hugo content file"""
    try:
        with open(hugo_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse Hugo frontmatter
        frontmatter, post_content = parse_hugo_frontmatter(content)
        
        # Generate slug for output filename (convert index.md to slug.mdx)
        if hugo_file.name == 'index.md':
            slug = hugo_file.parent.name
        else:
            slug = hugo_file.stem
            
        # Convert to Astro format
        astro_frontmatter = convert_to_astro_frontmatter(frontmatter, content_type)
        astro_content = convert_hugo_shortcodes(post_content, slug)
        
        output_file = output_dir / f"{slug}.mdx"
        
        # Create final Astro content
        final_content = f"{format_astro_frontmatter(astro_frontmatter)}\n\n{astro_content}"
        
        # Write to temp directory
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        return True, output_file, None
        
    except Exception as e:
        return False, hugo_file, str(e)

def find_content_files(content_type):
    """Find all Hugo content files for a content type"""
    content_dir = HUGO_CONTENT_DIR / content_type
    
    if not content_dir.exists():
        return []
    
    files = []
    # Look for index.md files in subdirectories and .md files in root
    for item in content_dir.iterdir():
        if item.is_dir():
            index_file = item / 'index.md'
            if index_file.exists():
                files.append(index_file)
        elif item.is_file() and item.suffix == '.md':
            files.append(item)
    
    return sorted(files)

def migrate_content_type(content_type, batch_size=5, start_index=0):
    """Migrate a content type in batches"""
    print(f"\n🚀 Starting migration of {content_type} content")
    
    # Find all files
    hugo_files = find_content_files(content_type)
    total_files = len(hugo_files)
    
    if not hugo_files:
        print(f"❌ No {content_type} files found")
        return
    
    print(f"📁 Found {total_files} {content_type} files")
    
    # Calculate batch
    end_index = min(start_index + batch_size, total_files)
    batch_files = hugo_files[start_index:end_index]
    
    if not batch_files:
        print(f"✅ All {content_type} files processed (start_index {start_index} >= {total_files})")
        return
    
    print(f"📦 Processing batch: files {start_index + 1}-{end_index} of {total_files}")
    
    # Setup output directory
    output_dir = TEMP_OUTPUT_DIR / content_type
    
    # Process each file
    success_count = 0
    for hugo_file in batch_files:
        success, result_file, error = process_content_file(hugo_file, content_type, output_dir)
        
        if success:
            print(f"✅ Converted: {hugo_file.name} → {result_file.name}")
            success_count += 1
        else:
            print(f"❌ Failed: {result_file} - {error}")
    
    print(f"\n📊 Batch Summary:")
    print(f"   ✅ Successful: {success_count}/{len(batch_files)}")
    print(f"   📂 Output directory: {output_dir}")
    print(f"   📝 Review files before copying to final location")
    
    if end_index < total_files:
        print(f"   ➡️  Next batch: --start-index={end_index}")

def main():
    parser = argparse.ArgumentParser(description='Migrate Hugo micro content to Astro')
    parser.add_argument('content_type', choices=['micro', 'elsewhere', 'quote', 'imagery'],
                       help='Content type to migrate')
    parser.add_argument('--batch-size', type=int, default=5,
                       help='Number of files to process in this batch (default: 5)')
    parser.add_argument('--start-index', type=int, default=0,
                       help='Starting file index (default: 0)')
    
    args = parser.parse_args()
    
    # Ensure temp directories exist
    ensure_temp_directories()
    
    # Migrate the specified content type
    migrate_content_type(args.content_type, args.batch_size, args.start_index)
    
    print(f"\n🔍 REVIEW PROCESS:")
    print(f"1. Check files in: {TEMP_OUTPUT_DIR / args.content_type}")
    print(f"2. If approved, copy to: /Users/jackivers/Projects/cto4ai-blog/src/data/{args.content_type}/")
    print(f"3. Test in browser")
    print(f"4. Git commit successful batch")
    print(f"5. Run next batch if needed")

if __name__ == "__main__":
    main()