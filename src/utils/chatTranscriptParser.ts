export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: {
    source?: 'claude-code' | 'cursor' | 'claude-ai' | 'chatgpt' | 'unknown';
    exportDate?: string;
    exportInfo?: string;
  };
}

/**
 * Detect the source of the transcript based on patterns
 */
function detectSource(text: string): 'cursor' | 'claude-code' | 'claude-ai' | 'chatgpt' | 'unknown' {
  if (text.includes('from Claude Code') || text.includes('Claude Code session')) return 'claude-code';
  if (text.includes('from Cursor')) return 'cursor';
  if (text.includes('Human:') && text.includes('Assistant:')) return 'claude-ai';
  if (text.includes('ChatGPT')) return 'chatgpt';
  return 'unknown';
}

/**
 * Extract export information from header
 */
function extractExportInfo(text: string): { exportInfo?: string; exportDate?: string } {
  const exportMatch = text.match(/_Exported on (.+?) at (.+?) from (.+?)_/);
  if (exportMatch) {
    return {
      exportInfo: exportMatch[0].replace(/_/g, ''),
      exportDate: `${exportMatch[1]} ${exportMatch[2]}`,
    };
  }
  return {};
}

/**
 * Parse Claude Code export format
 */
function parseClaudeCodeExport(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const { exportInfo, exportDate } = extractExportInfo(text);

  // Remove the header/title if present
  let cleanedText = text;
  cleanedText = cleanedText.replace(/^#.*?\n/, ''); // Remove title
  cleanedText = cleanedText.replace(/_Claude Code session.*?_\n?/, ''); // Remove Claude Code session info
  cleanedText = cleanedText.replace(/_Exported on.*?_\n?/, ''); // Remove export info

  // Better approach: manually find message boundaries
  // Look for patterns like "\n---\n\n**User**" or "\n---\n\n**Claude**"
  const messagePattern = /\n---\n\n\*\*(User|Claude|Assistant)\*\*/g;
  const boundaries: number[] = [0]; // Start of the text

  let match;
  while ((match = messagePattern.exec(cleanedText)) !== null) {
    boundaries.push(match.index + 5); // +5 to skip past "\n---\n"
  }
  boundaries.push(cleanedText.length); // End of the text

  // Extract messages between boundaries
  for (let i = 0; i < boundaries.length - 1; i++) {
    const section = cleanedText.substring(boundaries[i], boundaries[i + 1]);
    const trimmedSection = section.trim();

    if (!trimmedSection) continue;

    // Check if this section starts with **User** or **Claude**/**Assistant**
    if (trimmedSection.startsWith('**User**')) {
      let content = trimmedSection.replace(/^\*\*User\*\*\n?/, '').trim();
      // Remove trailing --- separator and excessive blank lines
      content = content
        .replace(/\n?---\s*$/, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (content) {
        messages.push({
          role: 'user',
          content,
          metadata:
            messages.length === 0 ? { source: 'claude-code', exportDate, exportInfo } : { source: 'claude-code' },
        });
      }
    } else if (trimmedSection.startsWith('**Claude**') || trimmedSection.startsWith('**Assistant**')) {
      // For assistant messages, capture EVERYTHING after the marker
      let content = trimmedSection.replace(/^\*\*(Claude|Assistant)\*\*\n?/, '').trim();
      // Remove trailing --- separator and excessive blank lines
      content = content
        .replace(/\n?---\s*$/, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (content) {
        messages.push({
          role: 'assistant',
          content,
          metadata: { source: 'claude-code' },
        });
      }
    }
  }

  return messages;
}

/**
 * Parse Cursor export format
 */
function parseCursorExport(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const { exportInfo, exportDate } = extractExportInfo(text);

  // Remove the header/title if present
  let cleanedText = text;
  cleanedText = cleanedText.replace(/^#.*?\n/, ''); // Remove title
  cleanedText = cleanedText.replace(/_Exported on.*?_\n?/, ''); // Remove export info

  // Better approach: manually find message boundaries
  // Look for patterns like "\n---\n\n**User**" or "\n---\n\n**Cursor**"
  const messagePattern = /\n---\n\n\*\*(User|Cursor|Assistant)\*\*/g;
  const boundaries: number[] = [0]; // Start of the text

  let match;
  while ((match = messagePattern.exec(cleanedText)) !== null) {
    boundaries.push(match.index + 5); // +5 to skip past "\n---\n"
  }
  boundaries.push(cleanedText.length); // End of the text

  // Extract messages between boundaries
  for (let i = 0; i < boundaries.length - 1; i++) {
    const section = cleanedText.substring(boundaries[i], boundaries[i + 1]);
    const trimmedSection = section.trim();

    if (!trimmedSection) continue;

    // Check if this section starts with **User** or **Cursor**/**Assistant**
    if (trimmedSection.startsWith('**User**')) {
      let content = trimmedSection.replace(/^\*\*User\*\*\n?/, '').trim();
      // Remove trailing --- separator and excessive blank lines
      content = content
        .replace(/\n?---\s*$/, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (content) {
        messages.push({
          role: 'user',
          content,
          metadata: messages.length === 0 ? { source: 'cursor', exportDate, exportInfo } : { source: 'cursor' },
        });
      }
    } else if (trimmedSection.startsWith('**Cursor**') || trimmedSection.startsWith('**Assistant**')) {
      // For assistant messages, capture EVERYTHING after the marker
      let content = trimmedSection.replace(/^\*\*(Cursor|Assistant)\*\*\n?/, '').trim();
      // Remove trailing --- separator and excessive blank lines
      content = content
        .replace(/\n?---\s*$/, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (content) {
        messages.push({
          role: 'assistant',
          content,
          metadata: { source: 'cursor' },
        });
      }
    }
  }

  return messages;
}

/**
 * Parse Claude.ai format
 */
function parseClaudeAI(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];

  // Split by role markers
  const parts = text.split(/\n(?=Human:|Assistant:)/);

  for (const part of parts) {
    const trimmedPart = part.trim();

    if (trimmedPart.startsWith('Human:')) {
      let content = trimmedPart.replace(/^Human:\s*/, '').trim();
      // Remove excessive blank lines
      content = content.replace(/\n{3,}/g, '\n\n').trim();
      messages.push({
        role: 'user',
        content,
        metadata: messages.length === 0 ? { source: 'claude-ai' } : undefined,
      });
    } else if (trimmedPart.startsWith('Assistant:')) {
      let content = trimmedPart.replace(/^Assistant:\s*/, '').trim();
      // Remove excessive blank lines
      content = content.replace(/\n{3,}/g, '\n\n').trim();
      messages.push({
        role: 'assistant',
        content,
        metadata: { source: 'claude-ai' },
      });
    }
  }

  return messages;
}

/**
 * Parse ChatGPT format
 */
function parseChatGPT(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];

  // Remove the header/title if present
  let cleanedText = text;
  cleanedText = cleanedText.replace(/^#.*?\n/, ''); // Remove title
  cleanedText = cleanedText.replace(/_ChatGPT session.*?_\n?/, ''); // Remove ChatGPT session info

  // First try the ** format (like **User** and **Assistant**)
  const messagePattern = /\n---\n\n\*\*(User|Assistant)\*\*/g;
  const boundaries: number[] = [0]; // Start of the text

  let match;
  while ((match = messagePattern.exec(cleanedText)) !== null) {
    boundaries.push(match.index + 5); // +5 to skip past "\n---\n"
  }

  if (boundaries.length > 1) {
    // We found ** format messages
    boundaries.push(cleanedText.length); // End of the text

    // Extract messages between boundaries
    for (let i = 0; i < boundaries.length - 1; i++) {
      const section = cleanedText.substring(boundaries[i], boundaries[i + 1]);
      const trimmedSection = section.trim();

      if (!trimmedSection) continue;

      // Check if this section starts with **User** or **Assistant**
      if (trimmedSection.startsWith('**User**')) {
        let content = trimmedSection.replace(/^\*\*User\*\*\n?/, '').trim();
        // Clean up ChatGPT citation markers (including Unicode private use area chars)
        content = content.replace(/[\ue200-\ue202]*cite[\ue200-\ue202]*turn\d+[\w\d\ue200-\ue202]*/g, '');
        // Remove trailing --- separator and excessive blank lines
        content = content
          .replace(/\n?---\s*$/, '')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/  +/g, ' ')
          .trim();
        if (content) {
          messages.push({
            role: 'user',
            content,
            metadata: messages.length === 0 ? { source: 'chatgpt' } : undefined,
          });
        }
      } else if (trimmedSection.startsWith('**Assistant**')) {
        let content = trimmedSection.replace(/^\*\*Assistant\*\*\n?/, '').trim();
        // Clean up ChatGPT citation markers (including Unicode private use area chars)
        content = content.replace(/[\ue200-\ue202]*cite[\ue200-\ue202]*turn\d+[\w\d\ue200-\ue202]*/g, '');
        // Remove trailing --- separator and excessive blank lines
        content = content
          .replace(/\n?---\s*$/, '')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/  +/g, ' ')
          .trim();
        if (content) {
          messages.push({
            role: 'assistant',
            content,
            metadata: { source: 'chatgpt' },
          });
        }
      }
    }
  } else {
    // Fall back to traditional format: "User:" and "ChatGPT:" or "Assistant:"
    const parts = text.split(/\n(?=User:|ChatGPT:|Assistant:)/);

    for (const part of parts) {
      const trimmedPart = part.trim();

      if (trimmedPart.startsWith('User:')) {
        let content = trimmedPart.replace(/^User:\s*/, '').trim();
        // Clean up ChatGPT citation markers (including Unicode private use area chars)
        content = content.replace(/[\ue200-\ue202]*cite[\ue200-\ue202]*turn\d+[\w\d\ue200-\ue202]*/g, '');
        // Remove excessive blank lines
        content = content
          .replace(/\n{3,}/g, '\n\n')
          .replace(/  +/g, ' ')
          .trim();
        messages.push({
          role: 'user',
          content,
          metadata: messages.length === 0 ? { source: 'chatgpt' } : undefined,
        });
      } else if (trimmedPart.startsWith('ChatGPT:') || trimmedPart.startsWith('Assistant:')) {
        let content = trimmedPart.replace(/^(ChatGPT|Assistant):\s*/, '').trim();
        // Clean up ChatGPT citation markers (including Unicode private use area chars)
        content = content.replace(/[\ue200-\ue202]*cite[\ue200-\ue202]*turn\d+[\w\d\ue200-\ue202]*/g, '');
        // Remove excessive blank lines
        content = content
          .replace(/\n{3,}/g, '\n\n')
          .replace(/  +/g, ' ')
          .trim();
        messages.push({
          role: 'assistant',
          content,
          metadata: { source: 'chatgpt' },
        });
      }
    }
  }

  // If no messages found, try another format
  if (messages.length === 0) {
    // Format 2: Numbered format like "1. User: ..."
    const numberedParts = text.split(/\n\d+\.\s+/);
    for (const part of numberedParts) {
      const trimmedPart = part.trim();
      if (trimmedPart.startsWith('User:')) {
        const content = trimmedPart.replace(/^User:\s*/, '').trim();
        messages.push({
          role: 'user',
          content,
          metadata: messages.length === 0 ? { source: 'chatgpt' } : undefined,
        });
      } else if (trimmedPart.includes('ChatGPT:') || trimmedPart.includes('Assistant:')) {
        const content = trimmedPart.replace(/^(ChatGPT|Assistant):\s*/, '').trim();
        messages.push({
          role: 'assistant',
          content,
          metadata: { source: 'chatgpt' },
        });
      }
    }
  }

  return messages;
}

/**
 * Generic fallback parser for unknown formats
 */
function parseGeneric(text: string): ChatMessage[] {
  const messages: ChatMessage[] = [];

  // Try to split by common patterns
  const lines = text.split('\n');
  let currentMessage: Partial<ChatMessage> | null = null;
  let contentBuffer: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for role indicators
    if (trimmedLine.match(/^(User|Human|You):/i)) {
      if (currentMessage && contentBuffer.length > 0) {
        currentMessage.content = contentBuffer.join('\n').trim();
        messages.push(currentMessage as ChatMessage);
      }
      currentMessage = { role: 'user', metadata: messages.length === 0 ? { source: 'unknown' } : undefined };
      contentBuffer = [trimmedLine.replace(/^[^:]+:\s*/, '')];
    } else if (trimmedLine.match(/^(Assistant|AI|Claude|ChatGPT|Bot):/i)) {
      if (currentMessage && contentBuffer.length > 0) {
        currentMessage.content = contentBuffer.join('\n').trim();
        messages.push(currentMessage as ChatMessage);
      }
      currentMessage = { role: 'assistant', metadata: { source: 'unknown' } };
      contentBuffer = [trimmedLine.replace(/^[^:]+:\s*/, '')];
    } else if (trimmedLine && currentMessage) {
      contentBuffer.push(trimmedLine);
    }
  }

  // Add the last message
  if (currentMessage && contentBuffer.length > 0) {
    currentMessage.content = contentBuffer.join('\n').trim();
    messages.push(currentMessage as ChatMessage);
  }

  return messages;
}

/**
 * Auto-detect and parse transcript
 */
export function autoDetectAndParse(text: string): ChatMessage[] {
  const source = detectSource(text);

  switch (source) {
    case 'claude-code':
      return parseClaudeCodeExport(text);
    case 'cursor':
      return parseCursorExport(text);
    case 'claude-ai':
      return parseClaudeAI(text);
    case 'chatgpt':
      return parseChatGPT(text);
    default: {
      // Try each parser and return the one with results
      let messages = parseClaudeCodeExport(text);
      if (messages.length > 0) return messages;

      messages = parseCursorExport(text);
      if (messages.length > 0) return messages;

      messages = parseClaudeAI(text);
      if (messages.length > 0) return messages;

      messages = parseChatGPT(text);
      if (messages.length > 0) return messages;

      // Fallback to generic parser
      return parseGeneric(text);
    }
  }
}

/**
 * Main export function - parse any transcript format
 */
export function parseTranscript(text: string): ChatMessage[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  return autoDetectAndParse(text);
}
