import query from '../query';

const sentiment = async (text: string): Promise<string> => {
  const { data } = await query(
    `
    {
      sentiment(language: "English", sentence: $text)
    }
  `,
    { text }
  );
  if (data.sentiment > 0) return 'Positive';
  if (data.sentiment < 0) return 'Negative';
  return 'Neutral';
};

export default sentiment;