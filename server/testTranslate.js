import { translate } from '@vitalets/google-translate-api';


async function test() {
  try {
    const result = await translate('How to reset password?', { to: 'hi' });
    console.log('Translated Text:', result.text);
  } catch (err) {
    console.error('Translation error:', err);
  }
}

test();
