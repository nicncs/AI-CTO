import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question or text",
      }
    });
    return;
  }

  console.log('Starting chat completion request');
try {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: generatePrompt(question)
  });
  console.log('Successfully received chat completion');
  console.log(completion.data.choices[0].message)
  res.status(200).json({ result: completion.data.choices[0].message.content});
} catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question){
  //const capitalizedAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    let prompt=[
      {"role": "system", "content": "You are a CTO of a Series A company speaking to a software engineer."},
      {"role": "user", "content": "Please introduce yourself"},
      {"role": "assistant", "content": "My name is AI CTO, and I am an Artificial Intelligence language model trained on our company data. As an AI language model, my primary function is to process and generate human-like language based on the input given to me. I can assist you in various tasks such as what's our technical strategy, answering questions, providing suggestions, and many more."},
      {"role": "user", "content": "What is the tech strategy for our company?"},
      {"role": "assistant", "content": "We have the following 6 tech strategies: 1.Shift-left, 2.Feedback Loop, 3.Optimize cost, 4.Fix tech debts, 5.Regenerate culture, and 6.Innovate."},
      {"role": "user", "content": `${question}`}
    ]
    return prompt;
}



/*
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
*/