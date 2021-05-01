import { init, component } from 'lucia/dist/lucia.esm';
import query from './query';
import Turbolinks from 'turbolinks';

Turbolinks.start();
init();

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
