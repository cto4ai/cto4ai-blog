#!/usr/bin/env python3
"""
Convert AI chat transcripts from various sources to TypeScript format for use in blog posts.

Supports multiple formats:
- Claude Code (from /export command or copy)
- Cursor exports
- Claude.ai conversations (claude-conversation-extractor format)
- Claude.ai conversations (legacy format)
- ChatGPT exports
"""

import re
import sys
import argparse
from datetime import datetime
from pathlib import Path
from typing import List, Tuple, Optional
from abc import ABC, abstractmethod


class TranscriptConverter(ABC):
    """Base class for transcript converters."""
    
    @abstractmethod
    def detect(self, content: str) -> bool:
        """Check if this converter can handle the given content."""
        pass
    
    @abstractmethod
    def convert(self, content: str) -> str:
        """Convert the content to markdown format suitable for TypeScript."""
        pass
    
    @abstractmethod
    def get_source_name(self) -> str:
        """Get the name of the source (e.g., 'Claude Code', 'Cursor')."""
        pass


class ClaudeCodeConverter(TranscriptConverter):
    """Converter for Claude Code transcripts."""

    def detect(self, content: str) -> bool:
        """Detect Claude Code format by looking for specific patterns."""
        # Only match if we find the actual export/welcome indicators or the special bullet
        # Don't match on just mentions of "Claude Code" in conversation text
        indicators = [
            "Welcome to Claude Code",
            "⏺",  # Claude Code's special bullet character
            "/export",
        ]
        # Also check for "from Claude Code" in first 500 chars (export header)
        has_export_header = "from Claude Code" in content[:500]
        has_session_header = "Claude Code session" in content[:500]

        return any(indicator in content for indicator in indicators) or has_export_header or has_session_header
    
    def convert(self, content: str) -> str:
        """Convert Claude Code transcript to clean markdown."""
        lines = content.split('\n')
        output = []
        
        # Clean up the welcome message if present
        if "Welcome to Claude Code" in content[:200]:
            # Skip the welcome box
            for i, line in enumerate(lines):
                if "What's new:" in line or (i > 10 and '>' in line):
                    lines = lines[i:]
                    break
        
        in_code_block = False
        code_block_indent = 0
        
        for line in lines:
            # Remove line numbers if present (format: "   123→content")
            line = re.sub(r'^\s*\d+→', '', line)
            
            # Handle Claude Code's special formatting
            line = line.replace('⏺', '**Claude:**')
            line = re.sub(r'^\s*⎿\s*', '  ', line)  # Sub-bullet indicator
            
            # Clean up box drawing characters
            if '╭' in line or '│' in line or '╰' in line or '─' in line:
                # This is likely a plan or output box
                if 'Plan:' in line or 'User rejected' in line:
                    # Extract the content from the box
                    continue  # Skip box drawing lines
                elif '│' in line:
                    # Extract content from inside the box
                    content = re.sub(r'^.*│\s*', '', line)
                    content = re.sub(r'\s*│.*$', '', content)
                    if content.strip():
                        output.append(content)
                continue
            
            # Handle user prompts (lines starting with >)
            if line.strip().startswith('>'):
                if line.strip() == '>':
                    continue
                output.append('\n---\n')
                output.append('**User**\n')
                # Remove the > and clean up
                user_content = line.strip()[1:].strip()
                if user_content:
                    output.append(user_content + '\n')
                continue
            
            # Handle code blocks
            if '```' in line:
                if not in_code_block:
                    in_code_block = True
                    code_block_indent = len(line) - len(line.lstrip())
                else:
                    in_code_block = False
                    code_block_indent = 0
            
            # Clean up tool usage indicators
            line = re.sub(r'^\s*Read\([^)]+\)$', '[Reading file]', line)
            line = re.sub(r'^\s*Write\([^)]+\)$', '[Writing file]', line)
            line = re.sub(r'^\s*Bash\([^)]+\)$', '[Running command]', line)
            line = re.sub(r'^\s*Search\([^)]+\)$', '[Searching]', line)
            line = re.sub(r'^\s*Task\([^)]+\)$', '[Running task]', line)
            
            # Escape backticks for TypeScript template literal
            if '```' in line:
                # Replace triple backticks with a special marker to handle them properly
                line = line.replace('```', '\\`\\`\\`')
            elif '`' in line and not in_code_block:
                # Only escape single backticks outside of code blocks
                line = line.replace('`', '\\`')
            
            output.append(line + '\n')
        
        return ''.join(output).strip()
    
    def get_source_name(self) -> str:
        return "Claude Code"


class CursorConverter(TranscriptConverter):
    """Converter for Cursor transcripts."""
    
    def detect(self, content: str) -> bool:
        """Detect Cursor format."""
        indicators = [
            "from Cursor",
            "**Cursor**",
            "_Exported on",
            "Cursor (1."  # Version number pattern
        ]
        return any(indicator in content for indicator in indicators)
    
    def convert(self, content: str) -> str:
        """Convert Cursor transcript to clean markdown."""
        # Cursor format is already pretty clean
        lines = content.split('\n')
        output = []
        in_code_block = False
        
        for line in lines:
            # Remove line numbers if present
            line = re.sub(r'^\s*\d+→', '', line)
            
            # Track code blocks
            if '```' in line:
                in_code_block = not in_code_block
            
            # Escape backticks for TypeScript template literal
            # Must escape ALL backticks, even inside code blocks, for template literal syntax
            if '```' in line:
                line = line.replace('```', '\\`\\`\\`')
            elif '`' in line:
                line = line.replace('`', '\\`')
            
            output.append(line + '\n')
        
        return ''.join(output).strip()
    
    def get_source_name(self) -> str:
        return "Cursor"


class ClaudeAIConverter(TranscriptConverter):
    """Converter for Claude.ai web interface transcripts."""
    
    def detect(self, content: str) -> bool:
        """Detect Claude.ai format."""
        indicators = [
            "Human:",
            "Assistant:",
            "Claude 3",
            "Anthropic"
        ]
        return ("Human:" in content and "Assistant:" in content)
    
    def convert(self, content: str) -> str:
        """Convert Claude.ai transcript to markdown."""
        content = content.replace("Human:", "\n---\n\n**User**\n\n")
        content = content.replace("Assistant:", "\n---\n\n**Claude**\n\n")
        
        # Escape backticks
        content = content.replace('`', '\\`')
        
        return content.strip()
    
    def get_source_name(self) -> str:
        return "Claude.ai"


class ClaudeConversationExtractorConverter(TranscriptConverter):
    """Converter for claude-conversation-extractor format."""

    def detect(self, content: str) -> bool:
        """Detect claude-conversation-extractor format."""
        indicators = [
            "# Claude Conversation Log",
            "Session ID:",
            "## 👤 User",
            "## 🤖 Claude"
        ]
        # Need both header and user/claude markers
        has_header = "# Claude Conversation Log" in content
        has_markers = ("## 👤 User" in content or "## 🤖 Claude" in content)
        return has_header and has_markers

    def convert(self, content: str) -> str:
        """Convert claude-conversation-extractor transcript to clean markdown."""
        lines = content.split('\n')
        output = []
        in_code_block = False
        skip_header = True

        for line in lines:
            # Skip header section (before first ---)
            if skip_header:
                if line.strip() == '---':
                    skip_header = False
                continue

            # Track code blocks
            if '```' in line:
                in_code_block = not in_code_block

            # Convert user/claude markers to standard format
            if line.strip() == '## 👤 User':
                output.append('\n---\n')
                output.append('\n**User**\n')
                continue

            if line.strip() == '## 🤖 Claude':
                output.append('\n---\n')
                output.append('\n**Claude**\n')
                continue

            # Skip separator lines (we add our own)
            if line.strip() == '---':
                continue

            # Skip interruption markers
            if '[Request interrupted' in line:
                continue

            # Escape backticks for TypeScript template literal
            # Must escape ALL backticks, even inside code blocks, for template literal syntax
            if '```' in line:
                line = line.replace('```', '\\`\\`\\`')
            elif '`' in line:
                line = line.replace('`', '\\`')

            output.append(line + '\n')

        return ''.join(output).strip()

    def get_source_name(self) -> str:
        return "Claude.ai"


class ChatGPTConverter(TranscriptConverter):
    """Converter for ChatGPT transcripts."""

    def detect(self, content: str) -> bool:
        """Detect ChatGPT format."""
        # Look for the specific patterns in ChatGPT transcripts
        patterns = [
            r'\*\*User:\*\*\s*',
            r'\*\*Assistant:\*\*\s*',
            r'\*\*ChatGPT:\*\*\s*',
        ]
        return any(re.search(pattern, content) for pattern in patterns)
    
    def convert(self, content: str) -> str:
        """Convert ChatGPT transcript to markdown with proper conversation turns."""
        # Clean up citation markers from entire content first (including Unicode private use area chars)
        content = re.sub(r'[\ue200-\ue202]*cite[\ue200-\ue202]*turn\d+[\w\d\ue200-\ue202]*', '', content)
        
        lines = content.split('\n')
        output = []
        in_code_block = False
        skip_next_separator = True  # Skip the first separator since we start fresh
        
        for line in lines:
            # Track code blocks to avoid escaping backticks inside them
            if '```' in line:
                in_code_block = not in_code_block
            
            # Handle User turns
            if re.match(r'^\*\*User:\*\*\s*$', line.strip()):
                if not skip_next_separator:
                    output.append('\n---\n')
                output.append('\n**User**\n')
                skip_next_separator = False
                continue
            
            # Handle Assistant/ChatGPT turns  
            if re.match(r'^\*\*(Assistant|ChatGPT):\*\*\s*$', line.strip()):
                if not skip_next_separator:
                    output.append('\n---\n')
                output.append('\n**Assistant**\n')
                skip_next_separator = False
                continue
            
            # Skip existing separators and empty lines right after role declarations
            if line.strip() == '---':
                continue
                
            # Skip header lines and metadata
            if line.startswith('#') and ('Conversation Transcript' in line or 'Date:' in line):
                continue
            if line.strip().startswith('_Date:') or line.strip().startswith('_ChatGPT') or line.strip().startswith('_('):
                continue
            
            # Handle content lines
            if line.strip():  # Non-empty lines
                # Citations already cleaned up at the beginning
                
                # Escape backticks for TypeScript template literal
                if '```' in line:
                    line = line.replace('```', '\\`\\`\\`')
                elif '`' in line and not in_code_block:
                    line = line.replace('`', '\\`')
                
                output.append(line + '\n')
            else:
                # Preserve empty lines for formatting
                output.append('\n')
        
        # Clean up the output
        result = ''.join(output).strip()
        
        # Remove multiple consecutive newlines
        result = re.sub(r'\n{3,}', '\n\n', result)
        
        # Citations should already be cleaned up
        
        # Clean up extra spaces
        result = re.sub(r'  +', ' ', result)
        
        return result
    
    def get_source_name(self) -> str:
        return "ChatGPT"


class TranscriptProcessor:
    """Main processor that manages all converters."""
    
    def __init__(self):
        # Order matters! More specific converters should be checked first
        self.converters = [
            ClaudeConversationExtractorConverter(),  # Most specific - check first
            ClaudeCodeConverter(),
            CursorConverter(),
            ClaudeAIConverter(),
            ChatGPTConverter(),
        ]
    
    def process(self, input_file: Path, output_file: Path, export_name: str = None, format: str = "auto") -> None:
        """Process a transcript file and convert it to TypeScript format."""
        
        # Read input file
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {input_file}: {e}")
            sys.exit(1)
        
        # Format mapping for forced formats
        format_mapping = {
            "claude-code": ClaudeCodeConverter,
            "cursor": CursorConverter,
            "claude-extractor": ClaudeConversationExtractorConverter,
            "claude-ai": ClaudeAIConverter,
            "chatgpt": ChatGPTConverter,
        }
        
        # Detect format and convert
        converter = None
        
        if format != "auto" and format in format_mapping:
            # Use forced format
            converter = format_mapping[format]()
            print(f"Using forced format: {converter.get_source_name()}")
        else:
            # Auto-detect format
            for conv in self.converters:
                if conv.detect(content):
                    converter = conv
                    print(f"Detected format: {conv.get_source_name()}")
                    break
        
        if not converter:
            print("Warning: Could not detect format, using generic conversion")
            # Fall back to basic escaping
            converted = content.replace('`', '\\`')
            source = "Unknown"
        else:
            converted = converter.convert(content)
            source = converter.get_source_name()
        
        # Generate TypeScript export
        if not export_name:
            # Generate from filename
            export_name = input_file.stem.replace('-', '_').replace(' ', '_')
            export_name = re.sub(r'[^a-zA-Z0-9_]', '', export_name)
            export_name = f"{export_name}Transcript"
        
        date_str = datetime.now().strftime("%m/%d/%Y")
        
        typescript_content = f"""export const {export_name} = `# {source} Conversation
_{source} session from {date_str}_

---

{converted}`;"""
        
        # Write output file
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(typescript_content)
            print(f"Successfully converted to {output_file}")
            print(f"Export name: {export_name}")
        except Exception as e:
            print(f"Error writing {output_file}: {e}")
            sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Convert AI chat transcripts to TypeScript format for blog posts"
    )
    parser.add_argument(
        "input",
        type=Path,
        help="Input transcript file"
    )
    parser.add_argument(
        "output",
        type=Path,
        help="Output TypeScript file"
    )
    parser.add_argument(
        "--export-name",
        help="Name for the TypeScript export (default: generated from filename)"
    )
    parser.add_argument(
        "--format",
        choices=["claude-code", "cursor", "claude-extractor", "claude-ai", "chatgpt", "auto"],
        default="auto",
        help="Force a specific format (default: auto-detect)"
    )
    
    args = parser.parse_args()
    
    processor = TranscriptProcessor()
    processor.process(args.input, args.output, args.export_name, args.format)


if __name__ == "__main__":
    main()