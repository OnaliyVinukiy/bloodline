/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import {
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  bloodBankContext,
} from "../config/azureConfig";

dotenv.config();

class ChatbotController {
  private static readonly openaiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  private static readonly openaiApiKey = process.env.AZURE_OPENAI_API_KEY;
  private static readonly deploymentName =
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

  //Normalize date format
  private static normalizeDateString(dateString: string): string | null {
    const datePattern = /(\d{1,2})(?:st|nd|rd|th)?\s([A-Za-z]+)\s(\d{4})/;
    const match = dateString.match(datePattern);

    if (match) {
      const months: { [key: string]: number } = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };

      const day = match[1].padStart(2, "0");
      const month = months[match[2]];
      const year = match[3];

      return month
        ? `${year}-${month.toString().padStart(2, "0")}-${day}`
        : null;
    }

    return null;
  }

  //Fetch appointments from database
  private static async fetchAppointments(query: string): Promise<string> {
    const client = new MongoClient(
      process.env.COSMOS_DB_CONNECTION_STRING as string
    );
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    try {
      const dateMatch = query.match(/on (\d{4}-\d{2}-\d{2})/);
      const dateMatchFormatted = query.match(
        /on (\d{1,2})(?:st|nd|rd|th)?\s([A-Za-z]+)\s(\d{4})/
      );

      let normalizedDate: string | null = null;
      if (dateMatch) {
        normalizedDate = dateMatch[1];
      } else if (dateMatchFormatted) {
        const dateString = `${dateMatchFormatted[1]} ${dateMatchFormatted[2]} ${dateMatchFormatted[3]}`;
        normalizedDate = ChatbotController.normalizeDateString(dateString);
      }

      if (normalizedDate) {
        const startDate = new Date(normalizedDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(normalizedDate);
        endDate.setHours(23, 59, 59, 999);

        const appointments = await collection
          .find({
            selectedDate: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
          })
          .toArray();

        return appointments.length > 0
          ? `📅 There are ${appointments.length} appointments scheduled on ${normalizedDate}.`
          : `❌ No appointments are scheduled on ${normalizedDate}.`;
      }

      const totalAppointments = await collection.countDocuments();
      return `📋 There are a total of ${totalAppointments} appointments.`;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return "⚠️ Sorry, I couldn't fetch appointment data at the moment.";
    } finally {
      await client.close();
    }
  }

  //Call OpenAI API with system instruction
  public static async callAzureOpenAI(userMessage: string): Promise<string> {
    try {
      if (!this.openaiEndpoint || !this.openaiApiKey || !this.deploymentName) {
        throw new Error("Azure OpenAI configuration is missing.");
      }

      const response = await axios.post(
        `${this.openaiEndpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2024-02-15-preview`,
        {
          messages: [
            {
              role: "system",
              content: bloodBankContext,
            },
            { role: "user", content: userMessage },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": this.openaiApiKey,
          },
        }
      );

      return (
        response.data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that request."
      );
    } catch (error: any) {
      console.error(
        "Azure OpenAI API error:",
        error.response?.data || error.message
      );
      return "🚨 Sorry, I'm having trouble connecting to the system. Please try again later.";
    }
  }

  //Handle incoming chatbot messages
  public async handleChat(req: Request, res: Response): Promise<Response> {
    try {
      const { message } = req.body;
      if (!message)
        return res.status(400).json({ reply: "⚠️ Message is required." });

      const lowerMessage = message.toLowerCase();

      //Check for eligibility related queries
      const eligibilityKeywords = [
        "eligibility",
        "eligible",
        "criteria",
        "can i donate",
        "who can donate",
        "blood donation rules",
        "donor requirements",
      ];

      if (
        eligibilityKeywords.some((keyword) => lowerMessage.includes(keyword))
      ) {
        if (
          eligibilityKeywords.some((keyword) => lowerMessage.includes(keyword))
        ) {
          const eligibilityResponse =
            "To donate blood, you must be between 18-60 years old with hemoglobin above 12g/dL, in good health with no serious diseases or pregnancy, and have a valid ID. You need to wait at least 4 months between donations. You cannot donate if you engage in high-risk behaviors (like drug use or unprotected sex with multiple partners) or have certain medical conditions. Want me to check your specific eligibility? Just ask! 😊";

          return res.status(200).json({ reply: eligibilityResponse });
        }
      }

      //Check for appointment related queries
      if (lowerMessage.includes("appointment")) {
        const appointmentResponse = await ChatbotController.fetchAppointments(
          message
        );
        return res.status(200).json({ reply: appointmentResponse });
      }

      //Send message to OpenAI
      const aiResponse = await ChatbotController.callAzureOpenAI(message);
      return res.status(200).json({ reply: aiResponse });
    } catch (error) {
      console.error("Chat handler error:", error);
      return res.status(500).json({ reply: "🚨 Internal server error." });
    }
  }
}

export default new ChatbotController();
