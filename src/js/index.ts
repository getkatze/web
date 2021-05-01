import { init, component } from 'lucia/dist/lucia.esm';
import query from './query';
import Turbolinks from 'turbolinks';

Turbolinks.start();
init();

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

const campaignsState = {
  campaigns: [],
  async setCampaigns() {
    const campaignQuery = `
    query {
      campaigns {
        id
        name
        contractor
        description
        totalPrizeAmount
        participantLimit
        completed
      }
    }
    `;
    const { data } = await query(campaignQuery);
    this.campaigns = data.campaigns.filter((campaign) => !campaign.completed);
  },
};

const signup = async (username: string, password: string) => {
  const user = await query(
    `
    mutation {
      createUser(username: $name, password: $password){
        username
      }
    }
    `,
    {
      name: username,
      pass: password,
    }
  );

  return user.data.createUser.username;
};

interface campaigns {
  id: string;
  name: string;
  contractor: string;
  description: string;
  totalPrizeAmount?: number;
  participantLimit?: number;
  completed: boolean;
}

const ownedCampaigns = async (name: string): Promise<campaigns[]> => {
  let { data } = await query(
    `
  query {
    campaigns(user: $name){
      id
      name
      contractor
      description
      totalPrizeAmount
      participantLimit
      completed
    }
  }
  `,
    { name }
  );

  return data.campaigns;
};

const login = async (username: string, password: string): Promise<boolean> => {
  let data = await query(
    `
  query {
    login(username: $name, password: $pass) {
      id
      username
    }
  }
  `,
    { name: username, pass: password }
  );
  if (data.data.login.username !== null) {
    return true;
  } else {
    return false;
  }
};
