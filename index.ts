/**
 * Higgsfield Seedance 2.5 text-to-video example.
 *
 * Run: yarn higgsfield:example
 * Requires HF_CREDENTIALS in .env.local (KEY_ID:KEY_SECRET). Never logged.
 */
import 'dotenv/config'; // loads .env by default; .env.local is loaded below
import { config as loadEnv } from 'dotenv';
import { higgsfield, TimeoutError } from '@higgsfield/client/v2';

loadEnv({ path: '.env.local', override: false });

const MODEL = 'bytedance/seedance-2.5/text-to-video';

async function main(): Promise<void> {
  if (!process.env.HF_CREDENTIALS) {
    console.error('HF_CREDENTIALS is not set. Add it to .env.local as KEY_ID:KEY_SECRET.');
    process.exit(2);
  }

  console.log(`Submitting request to ${MODEL}...`);

  let result;
  try {
    // One submission only: the SDK retries only network errors and 5xx on the POST.
    result = await higgsfield.subscribe(MODEL, {
      input: {
        prompt: 'A cinematic scene at sunset',
        duration: 5,
        resolution: '720p',
        aspect_ratio: '16:9',
      },
      withPolling: true,
    });
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error('Timed out waiting for the generation. It may still be running on the server.');
    } else {
      console.error('Request failed:', err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }

  console.log(`request_id: ${result.request_id}`);
  console.log(`status: ${result.status}`);

  switch (result.status) {
    case 'completed': {
      const url = result.video?.url;
      if (!url) {
        console.error('Status is completed but no video URL was returned.');
        process.exit(1);
      }
      console.log(`Video URL: ${url}`);
      return;
    }
    case 'failed':
      console.error('Generation failed. Credits are refunded for failed requests.');
      process.exit(1);
    case 'nsfw':
      console.error('Generation was rejected by content moderation.');
      process.exit(1);
    default:
      // Covers 'canceled' and any other non-success state the SDK does not model.
      console.error(`Generation did not complete (status: ${result.status}).`);
      process.exit(1);
  }
}

main();
