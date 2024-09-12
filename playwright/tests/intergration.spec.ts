import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import { describe } from 'node:test';

describe('Integration tests for AI tool generation', () => {
  // Run the script that generates the prompt once for the tests
  test.beforeAll(() => {
    const script = 'cd .. && cd scripts && node scrapeEvents.js && node generateAiImage.js';
    execSync(script);
    // Image generate takes longer than 30 seconds default
    test.setTimeout(60000);
  });

  test('Prompt generation produces correct output', async () => {
    // Read the generated prompt
    const generatedPrompt = fs.readFileSync('../generated_prompt.txt', 'utf-8');

    // Define the expected prompt
    const expectedPromptStart = 'Create a visually appealing events poster using the following data:';
    const expectedPromptEnd = 'The poster should have a professional design with appropriate imagery and text layout. The color scheme should match a theme and the text should be clearly readable.';
    const expectedPromptEvent = 'Event:'
    const expectedPromptDate = 'Date:'
    const expectedPromptImage = 'Image:'

    // Check if the generated prompt matches the expected prompt
    expect(generatedPrompt.trim()).toMatch(new RegExp(`^${expectedPromptStart}`));
    expect(generatedPrompt.trim()).toMatch(new RegExp(`${expectedPromptEnd}$`,'m'));
    expect(generatedPrompt.trim()).toContain(expectedPromptEvent);
    expect(generatedPrompt.trim()).toContain(expectedPromptDate);
    expect(generatedPrompt.trim()).toContain(expectedPromptImage);
  });

  test('API interaction returns correct image URL', async () => {
    // Define expected patterns
    const expextedImageStart = "https://oaidalleapiprodscus.blob.core.windows.net/private/";
    const openaiOrg = process.env.OPENAI_ORG;

    // Check if the image URL is correctly saved
    const imageUrl = fs.readFileSync('../generated_image_url.txt', 'utf-8');
    expect(imageUrl.trim()).toMatch(new RegExp(`^${expextedImageStart}`));
    expect(imageUrl.trim()).toContain(openaiOrg);
  });

  test('Image download saves the image correctly', async () => {
  // Check if the image file is saved
  const fileExists = fs.existsSync('../eventsPoster.png');
  expect(fileExists).toBe(true);
  });
})
