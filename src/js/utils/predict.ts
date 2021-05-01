import query from '../query';

const predict = async (campaignId: string, text: string): Promise<string> => {
  const campaign = await query(
    `
      query {
        getCampaignById(campaignId: $id) {
          tasks options
        }
      }
      `,
    { id: campaignId }
  );
  const completedTasks = campaign.data.tasks.filter((t) => t.completed);

  if (completedTasks.length > 0) {
    await query(
      `
        mutation {
          clearClassifiers
        }
      `
    );
    const classifications = [];
    completedTasks.forEach((task) => {
      classifications.push([task.category, task.text]);
    });
    await query(
      `
        mutation {
          addClassifiers(text: $classsifications)
        }
      `,
      { classifications }
    );
  }

  const { data } = await query(
    `
      {
        classify(sentence: $sentence)
      }
    `,
    { sentence: text }
  );
  return data.classify;
};

export default predict;