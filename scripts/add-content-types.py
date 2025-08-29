#!/usr/bin/env python3
"""
Add contentType field to all MDX files based on their directory location.
This is Phase 1 of the Option 2A implementation.
"""

import os
import re
from pathlib import Path

# Define content type mappings
CONTENT_TYPE_MAP = {
    'posts': 'essay',
    'micro': 'brief',
    'elsewhere': 'elsewhere',
    'quote': 'quote'
}

def add_content_type(file_path, content_type):
    """Add contentType to MDX front matter if not already present."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if contentType already exists
    if 'contentType:' in content or 'contentType :' in content:
        print(f"  ⚠️  {file_path.name} already has contentType, skipping")
        return False
    
    # Find the end of front matter
    # MDX files have --- at start and end of front matter
    pattern = r'^---\n(.*?)\n---'
    match = re.match(pattern, content, re.DOTALL)
    
    if not match:
        print(f"  ❌ {file_path.name} - Could not find front matter")
        return False
    
    front_matter = match.group(1)
    
    # Add contentType after the title field if it exists, otherwise at the end
    lines = front_matter.split('\n')
    
    # Find where to insert contentType (after title if exists)
    insert_index = len(lines)
    for i, line in enumerate(lines):
        if line.startswith('title:'):
            insert_index = i + 1
            break
    
    # Insert contentType
    lines.insert(insert_index, f'contentType: "{content_type}"')
    
    # Reconstruct the content
    new_front_matter = '\n'.join(lines)
    new_content = f"---\n{new_front_matter}\n---{content[match.end():]}"
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  ✅ {file_path.name} - Added contentType: \"{content_type}\"")
    return True

def process_directory(base_path, dir_name, content_type):
    """Process all MDX files in a directory."""
    dir_path = base_path / 'src' / 'data' / dir_name
    
    if not dir_path.exists():
        print(f"❌ Directory not found: {dir_path}")
        return 0
    
    mdx_files = list(dir_path.glob('*.mdx'))
    
    print(f"\n📁 Processing {dir_name} directory ({len(mdx_files)} files)")
    print(f"   Content type: {content_type}")
    print("-" * 50)
    
    updated_count = 0
    for mdx_file in sorted(mdx_files):
        if add_content_type(mdx_file, content_type):
            updated_count += 1
    
    return updated_count

def main():
    """Main function to process all content directories."""
    # Get the project root
    project_root = Path('/Users/jackivers/Projects/cto4ai-blog')
    
    print("=" * 60)
    print("Adding contentType to all MDX files")
    print("=" * 60)
    
    total_updated = 0
    
    # Process each content type directory
    for dir_name, content_type in CONTENT_TYPE_MAP.items():
        updated = process_directory(project_root, dir_name, content_type)
        total_updated += updated
    
    print("\n" + "=" * 60)
    print(f"✅ Complete! Updated {total_updated} files")
    print("=" * 60)
    
    # Create a summary report
    report_path = project_root / 'docs' / 'issues' / 'phase1-contenttype-report.md'
    with open(report_path, 'w') as f:
        f.write(f"# Phase 1 ContentType Addition Report\n\n")
        f.write(f"## Summary\n")
        f.write(f"- Total files updated: {total_updated}\n")
        f.write(f"- Script completed successfully\n\n")
        f.write(f"## Content Type Mappings Applied\n")
        for dir_name, content_type in CONTENT_TYPE_MAP.items():
            f.write(f"- {dir_name}/ → contentType: \"{content_type}\"\n")
    
    print(f"\n📄 Report saved to: {report_path}")

if __name__ == "__main__":
    main()