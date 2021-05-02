import { init, component } from 'lucia/dist/lucia.esm';
import { query, client } from './query';

init();

const campaignsState = component({
  campaigns: [{
   name: "Welcome to Katze!",
   description: "Welcome to Katze! We hope you have a great time using the app!! :)",
   completed: false,
  }, {
    name: "Lemons or oranges?", description: "uwu, completed: false", completed: false
  }],
  a: "something",
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
});

campaignsState.mount("#campaignHtml")

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


const createCampaign = async (userId: string, name: string, description: string) => {
  client.mutation(
    `
    mutation CreateCampaign($name: String!,
      $contractor: String!,
      $options: [String!]!,
      $description: String!
      ) {
      createCampaign(
        name: $name,
        contractor: $contractor,
        options: $options,
        description: $description
      ) {
        name
        id
        options
        contractor
        description
      }
    }
    `, {
    name: name,
    contractor: userId,
    options: ["a", "b"],
    description: description,
  }).toPromise().then(result => {
    if(result.data) {
      return result.data
    }
    else {
      return false
    }
  })
}

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

let campaignForm = document.getElementById("campaignButton");
campaignForm.addEventListener("click", async () => {
  console.log("smh");
  let name = document.getElementById("campaignFormName").value;
  let description = document.getElementById("campaignFormDescription").value;
  console.log(`name: ${name}`)
  let a=  await createCampaign('John Doe', name, description);
    campaignsState.campaigns.push({
      name: a.name,
      description: a.description,
      completed: a.completed
    })
})