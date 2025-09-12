#!/usr/bin/env python3
"""
Generate social media preview image for cto4.ai with proper logo and fonts
"""

import os
import requests
import cairosvg
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pathlib import Path
import tempfile

def download_inter_fonts():
    """Download Inter font files from Google Fonts"""
    font_dir = Path("fonts")
    font_dir.mkdir(exist_ok=True)
    
    # Download Inter Regular and Italic TTF fonts from Google Fonts
    fonts = {
        "Inter-Regular.ttf": "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        "Inter-Italic.ttf": "https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.ttf"
    }
    
    downloaded_fonts = {}
    
    for font_name, font_url in fonts.items():
        font_path = font_dir / font_name
        
        if not font_path.exists():
            print(f"Downloading {font_name}...")
            try:
                response = requests.get(font_url)
                response.raise_for_status()
                font_path.write_bytes(response.content)
                print(f"Font saved to {font_path}")
            except Exception as e:
                print(f"Failed to download {font_name}: {e}")
                font_path = None
        
        downloaded_fonts[font_name.replace('.ttf', '')] = font_path
    
    return downloaded_fonts

def convert_svg_to_png(svg_path, output_size=(400, 120)):
    """Convert SVG logo to PNG with specified size"""
    if not Path(svg_path).exists():
        raise FileNotFoundError(f"SVG file not found: {svg_path}")
    
    # Read SVG content
    with open(svg_path, 'r') as f:
        svg_content = f.read()
    
    # Convert SVG to PNG using cairosvg
    png_data = cairosvg.svg2png(
        bytestring=svg_content.encode('utf-8'),
        output_width=output_size[0],
        output_height=output_size[1]
    )
    
    # Load as PIL Image
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
        tmp.write(png_data)
        tmp_path = tmp.name
    
    try:
        logo_img = Image.open(tmp_path)
        # Convert to RGBA if needed
        if logo_img.mode != 'RGBA':
            logo_img = logo_img.convert('RGBA')
        return logo_img
    finally:
        os.unlink(tmp_path)

def create_gradient_background(width, height):
    """Create the dark blue gradient background matching the current design"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # Colors from the current social preview (darker blue gradient for better contrast)
    color_top = (58, 73, 104)     # Darker blue at top
    color_bottom = (75, 105, 153) # Lighter blue at bottom
    
    for y in range(height):
        # Create smooth gradient
        ratio = y / height
        r = int(color_top[0] * (1 - ratio) + color_bottom[0] * ratio)
        g = int(color_top[1] * (1 - ratio) + color_bottom[1] * ratio)
        b = int(color_top[2] * (1 - ratio) + color_bottom[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def create_social_preview():
    """Create the social media preview image with proper logo and fonts"""
    width, height = 1200, 630
    
    # Create gradient background
    img = create_gradient_background(width, height)
    
    # Download fonts
    print("Downloading fonts...")
    fonts = download_inter_fonts()
    
    # Load fonts - much larger for social media preview
    font_size = 72
    try:
        if fonts['Inter-Regular'] and fonts['Inter-Regular'].exists():
            font_regular = ImageFont.truetype(str(fonts['Inter-Regular']), font_size)
        else:
            font_regular = ImageFont.load_default()
            
        if fonts['Inter-Italic'] and fonts['Inter-Italic'].exists():
            font_italic = ImageFont.truetype(str(fonts['Inter-Italic']), font_size)
        else:
            font_italic = font_regular
    except Exception as e:
        print(f"Font loading error: {e}")
        font_regular = ImageFont.load_default()
        font_italic = font_regular
    
    # Load and convert SVG logo
    print("Converting logo...")
    logo_svg_path = "/Users/jackivers/Projects/hugo/craftycto/docs/astro-blog-migration/creative-assets/final-logo/noBgWhite.svg"
    
    try:
        logo_img = convert_svg_to_png(logo_svg_path, (360, 108))
        
        # Position logo
        logo_x = (width - logo_img.width) // 2
        logo_y = 120
        
        # Paste logo onto background
        img.paste(logo_img, (logo_x, logo_y), logo_img)
        
    except Exception as e:
        print(f"Logo conversion error: {e}")
        # Fallback: draw text logo
        draw = ImageDraw.Draw(img)
        logo_text = "cto4ai"
        logo_bbox = draw.textbbox((0, 0), logo_text, font=font_regular)
        logo_width = logo_bbox[2] - logo_bbox[0]
        logo_x = (width - logo_width) // 2
        logo_y = 180
        draw.text((logo_x, logo_y), logo_text, fill='white', font=font_regular)
    
    # Draw tagline with italic "Summit"
    draw = ImageDraw.Draw(img)
    
    tagline_regular = "Transcend local maxima. "
    tagline_italic = "Summit."
    
    # Calculate text positioning to center both parts together
    regular_bbox = draw.textbbox((0, 0), tagline_regular, font=font_regular)
    regular_width = regular_bbox[2] - regular_bbox[0]
    
    italic_bbox = draw.textbbox((0, 0), tagline_italic, font=font_italic)
    italic_width = italic_bbox[2] - italic_bbox[0]
    
    total_width = regular_width + italic_width
    start_x = (width - total_width) // 2
    tagline_y = 320
    
    # Draw regular text part
    draw.text((start_x, tagline_y), tagline_regular, fill='white', font=font_regular)
    
    # Draw italic text part
    italic_x = start_x + regular_width
    draw.text((italic_x, tagline_y), tagline_italic, fill='white', font=font_italic)
    
    return img

def main():
    """Generate the social preview image"""
    print("Generating social media preview image...")
    
    try:
        # Create the image
        img = create_social_preview()
        
        # Save the image
        output_path = Path("src/assets/images/social-preview-v3.png")
        img.save(output_path, "PNG", quality=95, optimize=True)
        
        print(f"✅ Social preview image saved to {output_path}")
        print(f"✅ Image size: {img.size}")
        
    except Exception as e:
        print(f"❌ Error generating image: {e}")
        raise

if __name__ == "__main__":
    main()