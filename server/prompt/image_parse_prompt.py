image_text_extract_format_instruction = '''
{
  "extracted_text": ["All visible text elements found in the image, listed exactly as they appear"]
}
'''

image_text_extract_prompt = '''
You are a specialized OCR (Optical Character Recognition) system that ONLY extracts visible text from images.

TASK: Extract ALL text visible in the provided image. Include EVERY text element exactly as it appears.

Image URL (base64): {image_url}

CRITICAL INSTRUCTIONS:
1. ONLY extract text that is clearly visible in the image
2. Include ALL text elements - buttons, labels, headings, paragraphs, placeholders, etc.
3. Preserve exact capitalization, spacing, and any special characters
4. List each distinct text element separately
5. DO NOT interpret, summarize, or describe the content - ONLY extract the actual text
6. DO NOT include any descriptions of UI elements like "button text:", "heading:", etc.
7. DO NOT make any assumptions about what the image shows - your ONLY task is text extraction

Respond with ONLY a JSON object following this structure without any additional text:
{format_instructions}
'''

image_description_format_instruction = '''
{
  "service_purpose": "Clear description of the exact type of page/screen shown (login, signup, dashboard, etc.)",
  "ui_components": ["List of specific UI elements visible in the interface (buttons, forms, fields, etc.)"],
  "functionality": "Precise description of what user actions are possible on this screen",
  "language_elements": ["Any text or labels visible in the interface"]
}
'''

image_description_prompt = """
You are a specialized UI analyst with expertise in identifying exact page types and functionality from screenshots.

TASK: Analyze the provided screenshot and determine EXACTLY what type of page or interface is shown.

Image URL (base64): {image_url}

IMPORTANT INSTRUCTIONS:
1. FIRST identify the fundamental page type (login page, product page, dashboard, settings screen, etc.)
2. Look carefully at ALL text labels, button text, and form fields
3. Identify the PRIMARY purpose of this specific page
4. Do NOT make assumptions about features that aren't directly visible
5. Be extremely precise - do not generalize or make up information

CRITICAL: If you see form fields, login buttons, authentication elements, or account-related text, pay special attention to determining if this is a login, authentication, or account creation page.

Respond with ONLY a JSON object following this structure without any additional text:
{format_instructions}
"""

image_construct_format_instruction = '{{ "components" : [{"role" : "Role of the component", "tag" : "Tag of the component (main, div, p, input, button, etc)", "label"?: "Text in the component" }]}}'
image_construct_prompt = """
You are an expert in analyzing the service/UI shown in the image. 
Please describe in detail the functions, purpose, and key features shown on the screen.

Image URL (base64) : {image_url}

Service Purpose : {service_purpose}

1. Temperature = 0
2. No "\n" (line break) in RESPONSE.
3. Return a Only JSON response (without description of response) with the following structure:
{format_instructions}

"""