const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

class AIVisionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  /**
   * Analyze design with GPT-4 Vision
   */
  async analyzeWithGPT4Vision(imageBase64, options = {}) {
    const {
      framework = 'react',
      styling = 'tailwind',
      componentType = 'component',
      customPrompt = ''
    } = options;

    const systemPrompt = this.generateSystemPrompt(framework, styling, componentType);
    const userPrompt = customPrompt || this.generateDefaultPrompt(framework);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${imageBase64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.2,
      });

      return {
        code: this.extractCodeFromResponse(response.choices[0].message.content || ''),
        tokensUsed: response.usage?.total_tokens || 0,
        model: response.model,
        provider: 'openai'
      };
    } catch (error) {
      console.error('❌ GPT-4 Vision error:', error.message);
      throw new Error(`GPT-4 Vision failed: ${error.message}`);
    }
  }

  /**
   * Analyze design with Claude Vision
   */
  async analyzeWithClaudeVision(imageBase64, options = {}) {
    const {
      framework = 'react',
      styling = 'tailwind',
      componentType = 'component',
      customPrompt = ''
    } = options;

    const systemPrompt = this.generateSystemPrompt(framework, styling, componentType);
    const userPrompt = customPrompt || this.generateDefaultPrompt(framework);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet',
        max_tokens: 4096,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: userPrompt,
              },
            ],
          },
        ],
      });

      const textContent = response.content.find((block) => block.type === 'text');
      
      return {
        code: this.extractCodeFromResponse(textContent?.text || ''),
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        model: response.model,
        provider: 'claude'
      };
    } catch (error) {
      console.error('❌ Claude Vision error:', error.message);
      throw new Error(`Claude Vision failed: ${error.message}`);
    }
  }

  /**
   * Generate system prompt for AI
   */
  generateSystemPrompt(framework, styling, componentType) {
    return `You are an expert frontend developer specialized in converting designs to production-ready code using MoneyView Design System.

Framework: ${framework}
Styling: ${styling}
Component Type: ${componentType}

MONEYVIEW DESIGN SYSTEM:
Use MoneyView Design System components from local relative imports:

AVAILABLE COMPONENTS:
- Button: import { Button } from './whizdm-mv-pbds-3b30f5427c36/base-ui/button'
  Props: children, variant (primary, supportPrimary, supportSecondary, dangerPrimary, link), size (buttonDefault, buttonSmall), disabled, withIcon, iconName, onClick
- Card: import { Card } from './whizdm-mv-pbds-3b30f5427c36/base-ui/card'
  Props: id, variant (cardVariant1, cardVariant2), title, subTitle, children, chipText, icon, src
- Typography: import { Typography } from './whizdm-mv-pbds-3b30f5427c36/base-ui/typography'
  Props: variant (h1-h6, body1-body2, caption), children, fontWeight (regular, medium, semiBold), colorValue
- TextField: import { TextField } from './whizdm-mv-pbds-3b30f5427c36/base-ui/text-field'
  Props: placeholder, variant (outlined, filled), label, value, onChange
- Icon: import { Icon } from './whizdm-mv-pbds-3b30f5427c36/base-ui/icon'
  Props: name, size (small, medium, large)
- Checkbox: import { Checkbox } from './whizdm-mv-pbds-3b30f5427c36/base-ui/checkbox'
  Props: label, checked, onChange
- Chip: import { Chip } from './whizdm-mv-pbds-3b30f5427c36/base-ui/chip'
  Props: label, variant (filled, outlined)
- Dialog: import { Dialog } from './whizdm-mv-pbds-3b30f5427c36/base-ui/dialog'
  Props: title, children, open, onClose
- List: import { List } from './whizdm-mv-pbds-3b30f5427c36/base-ui/list'
  Props: items (array of strings)
- RadioButton: import { RadioButton } from './whizdm-mv-pbds-3b30f5427c36/base-ui/radio-button'
  Props: label, value, checked, onChange
- Slider: import { Slider } from './whizdm-mv-pbds-3b30f5427c36/base-ui/slider'
  Props: min, max, value, onChange
- Tab: import { Tab } from './whizdm-mv-pbds-3b30f5427c36/base-ui/tab'
  Props: tabs (array), activeTab, onTabChange
- Toggle: import { Toggle } from './whizdm-mv-pbds-3b30f5427c36/base-ui/toggle'
  Props: label, checked, onChange

CRITICAL RULES:
1. Generate ONLY code - no explanations, no markdown formatting except for code blocks
2. Use MoneyView Design System components for EVERY element
3. Analyze the image pixel by pixel to identify ALL UI elements
4. Extract EXACT text content, labels, and placeholders from the image
5. Identify ALL form fields, buttons, and interactive elements
6. Create a complete, functional form component
7. Use proper form structure with labels and validation
8. Match the design exactly - don't miss any elements
9. Use semantic HTML with proper accessibility (ARIA labels, alt text)
10. Make it mobile-responsive (mobile-first approach)
11. Include all necessary MoneyView DS imports
12. Add TypeScript types (if React/Next.js)
13. Include interactive states (hover, focus, active)
14. Use MoneyView DS variants and props correctly
15. Add helpful comments for complex logic

FORM ANALYSIS REQUIREMENTS:
- Identify EVERY input field in the image
- Extract the exact label text for each field
- Determine the input type (text, password, date, etc.)
- Find ALL buttons and their text
- Locate checkboxes, toggles, and other form controls
- Understand the complete form structure and flow

OUTPUT FORMAT:
Return the complete ${framework === 'html' ? 'HTML file with embedded CSS' : 'component code'} using MoneyView Design System components.`;
  }

  /**
   * Generate default user prompt
   */
  generateDefaultPrompt(framework) {
    return `You are analyzing a mobile app screenshot. This appears to be a PAN card details form with multiple input fields and buttons.

CRITICAL ANALYSIS - Look for these specific elements:
1. FORM FIELDS - Identify each input field:
   - PAN card number field (text input)
   - Date of birth field (date input)
   - PIN field (password input)
   - Password field (password input)
   - Confirm password field (password input)

2. BUTTONS - Find all buttons:
   - "Get offer" button (primary action)
   - Any other action buttons

3. FORM CONTROLS - Look for:
   - "Remember me" checkbox
   - Any toggles or switches

4. LAYOUT STRUCTURE - Identify:
   - Main card/container
   - Form sections
   - Labels and text content
   - Spacing and positioning

MONEYVIEW DESIGN SYSTEM MAPPING:
- Each input field → TextField component with proper label and placeholder
- "Get offer" button → Button component with variant="primary"
- "Remember me" → Checkbox component
- Main container → Card component
- Labels and text → Typography component

REQUIREMENTS:
- Extract EXACT text from the image (labels, placeholders, button text)
- Create a complete form with proper structure
- Use MoneyView DS components for ALL elements
- Match the exact layout and styling
- Include proper form validation structure

Generate a complete React component that recreates this exact form using MoneyView Design System components.`;
  }

  /**
   * Extract code from AI response
   */
  extractCodeFromResponse(content) {
    // Extract code from markdown code blocks
    const codeBlockRegex = /```(?:tsx?|jsx?|html)?\n([\s\S]*?)```/g;
    const matches = content.match(codeBlockRegex);
    
    if (matches && matches.length > 0) {
      return matches[0]
        .replace(/```(?:tsx?|jsx?|html)?\n/, '')
        .replace(/```$/, '')
        .trim();
    }
    
    return content.trim();
  }

  /**
   * Auto-select best AI provider based on content
   */
  async analyzeDesign(imageBase64, options = {}) {
    const { aiProvider = 'auto' } = options;
    
    if (aiProvider === 'openai') {
      return await this.analyzeWithGPT4Vision(imageBase64, options);
    } else if (aiProvider === 'claude') {
      // Temporarily use OpenAI until Claude model is fixed
      console.log('🔄 Claude temporarily disabled, using OpenAI...');
      return await this.analyzeWithGPT4Vision(imageBase64, options);
    } else {
      // Auto-select: use OpenAI for now
      return await this.analyzeWithGPT4Vision(imageBase64, options);
    }
  }
}

module.exports = AIVisionService;
