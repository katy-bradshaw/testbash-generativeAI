import { test, expect } from '@playwright/test';
import nock from 'nock';
import { execSync } from 'child_process';
import fs from 'fs';
import { describe } from 'node:test';

describe('Integration tests for AI tool generation', () => {
  const script = 'node generateAiImage.js';

  test('Prompt generation produces correct output', async () => {
    // Run the script that generates the prompt
    execSync(script);

    // Read the generated prompt
    const generatedPrompt = fs.readFileSync('generated_prompt.txt', 'utf-8');

    // Define the expected prompt
    const expectedPromptStart = 'Create a visually appealing event poster with the following details:';
    const expectedPromptEnd = 'The poster should have a professional design with appropriate imagery and text layout. The color scheme should match the theme of the events, and the text should be clearly readable.';
    const expectedPromptEvent = 'Event:'
    const expectedPromptDate = 'Date:'
    const expectedPromptImage = 'Image:'

    // Check if the generated prompt matches the expected prompt
    expect(generatedPrompt.trim()).toMatch(new RegExp(`^${expectedPromptStart}`));
    expect(generatedPrompt.trim()).toMatch(new RegExp(`${expectedPromptEnd}$`));
    expect(generatedPrompt.trim()).toContain(expectedPromptEvent);
    expect(generatedPrompt.trim()).toContain(expectedPromptDate);
    expect(generatedPrompt.trim()).toContain(expectedPromptImage);
  });

  test('API interaction returns correct image URL', async () => {
    // Mock the DALL-E API response
    nock('https://api.openai.com')
        .post('/v1/images/generations')
        .reply(200, {
            data: [{ url: 'http://example.com/mock_image.png' }]
        });

    // Run the script that generates the poster image
    execSync(script);

    // Check if the image URL is correctly saved
    const imageUrl = fs.readFileSync('image_url.txt', 'utf-8');
    expect(imageUrl.trim()).toBe('http://example.com/mock_image.png');
  });

  test('Image download saves the image correctly', async () => {
  // Mock the image URL response
  nock('http://example.com') // need to check what this url is when account in DALL-E set up
      .get('/mock_image.png')
      .reply(200, Buffer.from('mock image data'));

  // Run the script that downloads the image
  execSync(script);

  // Check if the image file is saved
  const fileExists = fs.existsSync('eventsPoster.png');
  expect(fileExists).toBe(true);
  });
})
