import { toast } from "sonner";

// Define types for our API responses
type OpenAIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

// Environment variable validation
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key is not set. Set VITE_OPENAI_API_KEY in your environment variables.");
    return null;
  }
  return apiKey;
};

// Generate a response from OpenAI based on the prompt
export const generateAIResponse = async (
  prompt: string,
  model: "gpt-4" | "claude" | "llama" = "gpt-4"
): Promise<string | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    toast.error("OpenAI API key is not configured");
    return null;
  }

  // Map our UI model names to actual API model names
  const modelMap = {
    "gpt-4": "gpt-4o",
    "claude": "gpt-4o", // We'll simulate Claude with GPT-4o
    "llama": "gpt-3.5-turbo" // We'll simulate Llama with GPT-3.5-turbo
  };

  const actualModel = modelMap[model];
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: actualModel,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that generates responses based on user prompts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Unknown error occurred");
    }

    const data = await response.json() as OpenAIResponse;
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    toast.error(`Error: ${error.message || "Failed to generate response"}`);
    return null;
  }
};