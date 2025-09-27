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

const SystemResponses = {
  // General Errors/Messages
  error_fetching_data: {
    en: "⚠️ Sorry, I couldn't fetch appointment data at the moment.",
    si: "⚠️ කණගාටුයි, මේ මොහොතේ මට වරයන් පිළිබඳ දත්ත ලබාගත නොහැකි විය.",
  },
  internal_error: {
    en: "🚨 Sorry, I'm having trouble connecting to the system. Please try again later.",
    si: "🚨 කණගාටුයි, පද්ධතියට සම්බන්ධ වීමේ ගැටලුවක් ඇත. කරුණාකර පසුව නැවත උත්සාහ කරන්න.",
  },
  message_required: {
    en: "⚠️ Message is required.",
    si: "⚠️ පණිවිඩයක් අවශ්‍යයි.",
  },
  // Eligibility
  eligibility: {
    en: "To donate blood, you must be between 18-60 years old with hemoglobin above 12g/dL, in good health with no serious diseases or pregnancy, and have a valid ID. You need to wait at least 4 months between donations. You cannot donate if you engage in high-risk behaviors (like drug use or unprotected sex with multiple partners) or have certain medical conditions. Want me to check your specific eligibility? Just ask! 😊",
    si: "රුධිරය පරිත්‍යාග කිරීම සඳහා, ඔබ වයස අවුරුදු 18-60 අතර විය යුතු අතර හිමොග්ලොබින් 12g/dL ට වැඩි විය යුතුය. බරපතල රෝග හෝ ගැබ් ගැනීම් නොමැති, හොඳ සෞඛ්‍ය තත්ත්වයෙන් සිටින, වලංගු හැඳුනුම්පතක් ඇති අයෙකු විය යුතුය. පරිත්‍යාග දෙකක් අතර අවම වශයෙන් මාස 4ක් රැඳී සිටිය යුතුය. අධි අවදානම් හැසිරීම් වල නිරත වන්නේ නම් (මත්ද්‍රව්‍ය භාවිතය හෝ බහු සහකරුවන් සමඟ අනාරක්ෂිත ලිංගික ඇසුර වැනි) හෝ ඇතැම් රෝගී තත්ත්වයන් ඇත්නම් ඔබට පරිත්‍යාග කළ නොහැක. ඔබගේ නිශ්චිත සුදුසුකම පරීක්ෂා කිරීමට අවශ්‍යද? අසන්න! 😊",
  },
  // General Appointment Slots
  slots: {
    fully_booked: {
      en: "❌ All appointment slots are fully booked for",
      si: "❌ සියලුම වරයන් වෙන්කරවා ගෙන ඇත",
    },
    available_slots_prefix: {
      en: "✅",
      si: "✅",
    },
    available_slots_suffix: {
      en: "appointment slot(s) available on",
      si: "වරයන් පවතී",
    },
    scheduled_by_others: {
      en: "There are currently",
      si: "දැනට වෙන්කර ඇති වරයන් සංඛ්‍යාව",
    },
    scheduled_by_others_suffix: {
      en: "appointments scheduled by other donors.",
      si: "කි.",
    },
    all_available: {
      en: "🗓️ All slots are currently available on",
      si: "🗓️ සියලුම වරයන් දැනට පවතී",
    },
    no_scheduled: {
      en: "No appointments have been scheduled yet.",
      si: "මෙතෙක් කිසිදු වරයක් වෙන්කරගෙන නැත.",
    },
    total_appointments: {
      en: "📋 There are a total of",
      si: "📋 මුළු වරයන් සංඛ්‍යාව",
    },
    total_appointments_suffix: {
      en: "appointments.",
      si: "කි.",
    },
  },
  // Personalized Status Messages
  personal_status: {
    no_appointment: {
      en: "You don't have any appointments scheduled yet. Would you like to book one?",
      si: "ඔබ මෙතෙක් කිසිදු වරයක් වෙන් කර නැත. වෙන්කරවා ගැනීමට කැමතිද?",
    },
    login_required: {
      en: "I need your user ID to check your personal status. Please ensure you are logged in to the application.",
      si: "ඔබගේ පුද්ගලික තත්ත්වය පරීක්ෂා කිරීමට ඔබගේ පරිශීලක හැඳුනුම්පත අවශ්‍ය වේ. කරුණාකර ඔබ යෙදුමට පිවිස ඇති බව තහවුරු කරන්න.",
    },
    approved: {
      en: "Approved",
      si: "අනුමතයි",
    },
    pending: {
      en: "Pending",
      si: "සමාලෝචනය වෙමින් පවතී",
    },
    rejected: {
      en: "Rejected",
      si: "ප්‍රතික්ෂේපිතයි",
    },
    cancelled: {
      en: "Cancelled",
      si: "අවලංගුයි",
    },
    approved_suffix: {
      en: " We look forward to seeing you! Check your email for reminders. 👍",
      si: " ඔබ එනතුරු අපි බලා සිටිමු! මතක් කිරීම් සඳහා ඔබගේ ඊමේල් පරීක්ෂා කරන්න. 👍",
    },
    pending_suffix: {
      en: " We are still reviewing your request. Please check back later. ⏳",
      si: " ඔබගේ ඉල්ලීම තවමත් සමාලෝචනය කරමින් සිටී. කරුණාකර පසුව නැවත පරීක්ෂා කරන්න. ⏳",
    },
    rejected_cancelled_message: {
      en: ". This appointment was ",
      si: " මෙම වරය ",
    },
    rejected_cancelled_suffix: {
      en: ". Please consider booking a new one!",
      si: " කර ඇත. කරුණාකර නව වරයක් වෙන්කරවා ගන්න!",
    },
  },
};

// Helper function to get translated text
type LangCode = "en" | "si";

const getTranslatedText = (
  path: string,
  lang: string,
  placeholders?: any
): string => {
  const langKey: LangCode = lang === "si" ? "si" : "en";
  const pathParts = path.split(".");

  let current: any = SystemResponses;
  for (const part of pathParts) {
    if (!current || !current[part]) {
      console.error(`Missing translation path: ${path}`);
      return `[Translation Error: ${path}]`;
    }
    current = current[part];
  }

  // The final object should contain language keys
  const text = current[langKey] || current.en;

  // Basic placeholder replacement
  if (placeholders) {
    let result = text;
    for (const key in placeholders) {
      result = result.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
        placeholders[key]
      );
    }
    return result;
  }

  return text;
};

class ChatbotController {
  private static readonly openaiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  private static readonly openaiApiKey = process.env.AZURE_OPENAI_API_KEY;
  private static readonly deploymentName =
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

  // Normalize date format
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

  private static getTodayFormattedDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private static getTomorrowFormattedDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
    const day = tomorrow.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch appointments from database
  private static async fetchAppointments(
    query: string,
    lang: string
  ): Promise<string> {
    const MAX_APPOINTMENTS_PER_DAY = 10;

    const client = new MongoClient(
      process.env.COSMOS_DB_CONNECTION_STRING as string
    );
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    try {
      const lowerQuery = query.toLowerCase();
      let normalizedDate: string | null = null;

      if (lowerQuery.includes("today")) {
        normalizedDate = this.getTodayFormattedDate();
      } else if (lowerQuery.includes("tomorrow")) {
        normalizedDate = this.getTomorrowFormattedDate();
      } else {
        const dateMatch = query.match(/on (\d{4}-\d{2}-\d{2})/);
        const dateMatchFormatted = query.match(
          /on (\d{1,2})(?:st|nd|rd|th)?\s([A-Za-z]+)\s(\d{4})/
        );

        if (dateMatch) {
          normalizedDate = dateMatch[1];
        } else if (dateMatchFormatted) {
          const dateString = `${dateMatchFormatted[1]} ${dateMatchFormatted[2]} ${dateMatchFormatted[3]}`;
          normalizedDate = ChatbotController.normalizeDateString(dateString);
        }
      }

      if (normalizedDate) {
        // Query database
        const appointments = await collection
          .find({
            selectedDate: normalizedDate,
          })
          .toArray();

        const count = appointments.length;
        const remainingSlots = MAX_APPOINTMENTS_PER_DAY - count;

        // Use translated messages
        if (count >= MAX_APPOINTMENTS_PER_DAY) {
          return `${getTranslatedText(
            "slots.fully_booked",
            lang
          )} ${normalizedDate}.`;
        } else if (count > 0) {
          return `${getTranslatedText(
            "slots.available_slots_prefix",
            lang
          )} ${remainingSlots} ${getTranslatedText(
            "slots.available_slots_suffix",
            lang
          )} ${normalizedDate}. ${getTranslatedText(
            "slots.scheduled_by_others",
            lang
          )} ${count} ${getTranslatedText(
            "slots.scheduled_by_others_suffix",
            lang
          )}`;
        } else {
          return `${getTranslatedText(
            "slots.all_available",
            lang
          )} ${normalizedDate}. ${getTranslatedText(
            "slots.no_scheduled",
            lang
          )}`;
        }
      }

      const totalAppointments = await collection.countDocuments();
      return `${getTranslatedText(
        "slots.total_appointments",
        lang
      )} ${totalAppointments} ${getTranslatedText(
        "slots.total_appointments_suffix",
        lang
      )}`;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return getTranslatedText("error_fetching_data", lang);
    } finally {
      await client.close();
    }
  }

  // Fetch user appointments status
  private static async fetchUserAppointmentStatus(
    email: string,
    lang: string
  ): Promise<string> {
    const client = new MongoClient(
      process.env.COSMOS_DB_CONNECTION_STRING as string
    );
    await client.connect();
    const database = client.db(DATABASE_ID);
    const collection = database.collection(APPOINTMENT_COLLECTION_ID);

    try {
      // Find the most recent appointment for the user
      const latestAppointment = await collection.findOne(
        { "donorInfo.email": email },
        { sort: { selectedDate: -1 } }
      );

      if (!latestAppointment) {
        return getTranslatedText("personal_status.no_appointment", lang);
      }

      const status = latestAppointment.status;
      const date = latestAppointment.selectedDate;
      const time = latestAppointment.selectedSlot;

      const statusTranslations: { [key: string]: string } = {
        Approved: getTranslatedText("personal_status.approved", lang),
        Pending: getTranslatedText("personal_status.pending", lang),
        Rejected: getTranslatedText("personal_status.rejected", lang),
        Cancelled: getTranslatedText("personal_status.cancelled", lang),
      };

      const statusText = statusTranslations[status] || status;

      let response =
        lang === "si"
          ? `ඔබගේ නවතම වරය ${date} දින ${time} ට යි. වත්මන් තත්ත්වය: **${statusText}**`
          : `Your most recent appointment is on ${date} at ${time}. The current status is: **${statusText}**`;

      if (status === "Approved") {
        response += getTranslatedText("personal_status.approved_suffix", lang);
      } else if (status === "Pending") {
        response += getTranslatedText("personal_status.pending_suffix", lang);
      } else if (status === "Rejected" || status === "Cancelled") {
        response += `${getTranslatedText(
          "personal_status.rejected_cancelled_message",
          lang
        )}${statusText}${getTranslatedText(
          "personal_status.rejected_cancelled_suffix",
          lang
        )}`;
      }

      return response;
    } catch (error) {
      console.error("Error fetching personalized status:", error);
      return getTranslatedText("error_fetching_data", lang);
    } finally {
      await client.close();
    }
  }

  // Call OpenAI API with system instruction
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

  // Handle incoming chatbot messages
  public async handleChat(req: Request, res: Response): Promise<Response> {
    try {
      const { message, email, lang = "en" } = req.body;

      if (!message)
        return res
          .status(400)
          .json({ reply: getTranslatedText("message_required", lang) });

      const lowerMessage = message.toLowerCase();

      const eligibilityKeywords = [
        "eligibility",
        "eligible",
        "criteria",
        "can i donate",
        "who can donate",
        "blood donation rules",
        "donor requirements",
        "සුදුසුකම්",
        "සුදුසුද",
        "නීති",
        "දන්දිය හැකිද",
      ];

      const personalStatusKeywords = [
        "my appointment",
        "my status",
        "status of my appointment",
        "check my booking",
        "next donation",
        "මගේ වරය",
        "මගේ තත්වය",
        "වරය පරීක්ෂා කරන්න",
        "ඊළඟ පරිත්‍යාගය",
      ];

      const appointmentKeywords = [
        "appointment",
        "book appointment",
        "appointment slot",
        "slots",
        "available slots",
        "slot",
        "are there any slots available",
        "වරය",
        "වරයන්",
        "වෙන්කරවා ගැනීම",
        "තිබේද",
      ];

      if (
        eligibilityKeywords.some((keyword) => lowerMessage.includes(keyword))
      ) {
        const eligibilityResponse = getTranslatedText("eligibility", lang);
        return res.status(200).json({ reply: eligibilityResponse });
      }

      if (
        personalStatusKeywords.some((keyword) => lowerMessage.includes(keyword))
      ) {
        if (!email) {
          return res.status(200).json({
            reply: getTranslatedText("personal_status.login_required", lang),
          });
        }
        const statusResponse =
          await ChatbotController.fetchUserAppointmentStatus(email, lang);
        return res.status(200).json({ reply: statusResponse });
      }

      if (
        appointmentKeywords.some((keyword) => lowerMessage.includes(keyword))
      ) {
        const appointmentResponse = await ChatbotController.fetchAppointments(
          message,
          lang
        );
        return res.status(200).json({ reply: appointmentResponse });
      }

      // Default AI response
      const aiResponse = await ChatbotController.callAzureOpenAI(message);
      return res.status(200).json({ reply: aiResponse });
    } catch (error) {
      console.error("Chat handler error:", error);
      return res
        .status(500)
        .json({ reply: getTranslatedText("internal_error", "en") });
    }
  }
}

export default new ChatbotController();
