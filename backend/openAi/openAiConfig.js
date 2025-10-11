import OpenAI from 'openai';

export const test = async (req, res) => {
  try {
    const { number, topic } = req.body;

    const client = new OpenAI({
      apiKey: process.env['OPEN_AI'], // GitHub Marketplace token
      baseURL: "https://models.github.ai/inference", // GitHub proxy endpoint
    });

    const prompt = `You have to create multiple choice questions in JSON format with the following structure:
[
  {
    "Question": "Your question here?",
    "Options": ["Option A", "Option B", "Option C", "Option D"],
    "Answer": "Correct Option"
  }
]
Create exactly ${number} questions on the topic "${topic}". Only return the JSON array. No explanation or extra text.`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates JSON MCQs." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const output = response.choices[0].message.content;

    // Extract JSON from the text (if necessary)
    const jsonStart = output.indexOf("[");
    const jsonEnd = output.lastIndexOf("]") + 1;
    const jsonString = output.substring(jsonStart, jsonEnd);
    const arr = JSON.parse(jsonString);

    return res.status(200).json(arr);

  } catch (error) {
    console.error("Error generating questions:", error.message);
    return res.status(500).json({ error: "Failed to generate questions" });
  }
};
// this feedback sentiment
export const feedback=async(req,res)=> {
  try {
    const { desciption } = req.body;

    const client = new OpenAI({
      apiKey: process.env['OPEN_AI'], // GitHub Marketplace token
      baseURL: "https://models.github.ai/inference", // GitHub proxy endpoint
    });

    const prompt = `You have to create multiple choice questions in JSON format with the following structure:`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates .csv." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });
  } catch (error) {
    
  }
  
}

// import OpenAI from 'openai';

// export const test = async (req, res) => {
//   try {
//     // Validate request body
//     if (!req.body || !req.body.number || !req.body.topic) {
//       return res.status(400).json({ 
//         error: "Missing required parameters: 'number' and 'topic' are required" 
//       });
//     }

//     const { number, topic } = req.body;

//     // Validate number is a positive integer
//     if (!Number.isInteger(number) || number <= 0) {
//       return res.status(400).json({ 
//         error: "Parameter 'number' must be a positive integer" 
//       });
//     }

//     const client = new OpenAI({
//       apiKey: process.env['OPEN_AI'],
//       baseURL: "https://models.github.ai/inference",
//     });

//     const prompt = `You have to create multiple choice questions in JSON format with the following structure:
// [
//   {
//     "Question": "Your question here?",
//     "Options": ["Option A", "Option B", "Option C", "Option D"],
//     "Answer": "Correct Option"
//   }
// ]
// Create exactly ${number} questions on the topic "${topic}". Only return the JSON array. No explanation or extra text.`;

//     const response = await client.chat.completions.create({
//       model: "openai/gpt-4o",
//       messages: [
//         { role: "system", content: "You are a helpful assistant that generates JSON MCQs." },
//         { role: "user", content: prompt }
//       ],
//       temperature: 0.7,
//     });
//     // console.log(JSON.parse(response));
//     const parsedResponse = JSON.parse(response);
//     // Check if response has choices
//     if (!parsedResponse.choices || parsedResponse.choices.length === 0) {
//       throw new Error("No choices returned from API");
//     }

//     const output = parsedResponse.choices[0].message.content;

//     // Extract JSON from the text
//     const jsonStart = output.indexOf("[");
//     const jsonEnd = output.lastIndexOf("]") + 1;
    
//     if (jsonStart === -1 || jsonEnd === 0) {
//       throw new Error("No JSON array found in response");
//     }
    
//     const jsonString = output.substring(jsonStart, jsonEnd);
//     const arr = JSON.parse(jsonString);

//     return res.status(200).json(arr);

//   } catch (error) {
//     console.error("Error generating questions:", error.message);
    
//     // More specific error messages
//     if (error.message.includes("No choices returned")) {
//       return res.status(500).json({ error: "API returned no response options" });
//     } else if (error.message.includes("No JSON array found")) {
//       return res.status(500).json({ error: "API response didn't contain valid JSON" });
//     } else if (error.message.includes("Authentication")) {
//       return res.status(401).json({ error: "Authentication failed. Check your API key." });
//     }
    
//     return res.status(500).json({ error: "Failed to generate questions" });
//   }
// };
