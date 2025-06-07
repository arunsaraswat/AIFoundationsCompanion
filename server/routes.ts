import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // OpenRouter completion endpoint
  app.post("/api/openrouter-completion", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 800
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const completion = data.choices[0]?.message?.content || "No completion received";
      
      res.json({ completion });
    } catch (error) {
      console.error("OpenRouter completion error:", error);
      res.status(500).json({ error: "Failed to get completion from OpenRouter" });
    }
  });

  // OpenAI Assistant endpoint
  app.post("/api/openai-assistant", async (req, res) => {
    try {
      const { prompt, assistantId } = req.body;
      
      if (!prompt || !assistantId) {
        return res.status(400).json({ error: "Prompt and assistantId are required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      // Create a thread
      const threadResponse = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({})
      });

      if (!threadResponse.ok) {
        throw new Error("Failed to create thread");
      }

      const thread = await threadResponse.json();

      // Add message to thread
      const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
          role: "user",
          content: prompt
        })
      });

      if (!messageResponse.ok) {
        throw new Error("Failed to add message");
      }

      // Run the assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      });

      if (!runResponse.ok) {
        throw new Error("Failed to start run");
      }

      const run = await runResponse.json();

      // Poll for completion
      let runStatus = run;
      while (runStatus.status === "queued" || runStatus.status === "in_progress") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2"
          }
        });

        if (!statusResponse.ok) {
          throw new Error("Failed to check run status");
        }

        runStatus = await statusResponse.json();
      }

      if (runStatus.status !== "completed") {
        throw new Error(`Run failed with status: ${runStatus.status}`);
      }

      // Get messages
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2"
        }
      });

      if (!messagesResponse.ok) {
        throw new Error("Failed to get messages");
      }

      const messages = await messagesResponse.json();
      const assistantMessage = messages.data.find((msg: any) => msg.role === "assistant");
      
      if (!assistantMessage) {
        throw new Error("No assistant response found");
      }

      const completion = assistantMessage.content[0].text.value;
      
      res.json({ completion });
    } catch (error) {
      console.error("OpenAI Assistant error:", error);
      res.status(500).json({ error: "Failed to get completion from OpenAI Assistant" });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
