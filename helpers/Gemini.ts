import { GoogleGenerativeAI } from "@google/generative-ai";
import useChat from "@zuztand/Chat";

export const fetchGeminiResponse = async (
  text: string,
  caseData: any,
  model: any,
  generationConfig: any
) => {
  const { setTranscripts, setChatHistory, setIsLoading } = useChat.getState();

  setIsLoading(true);

  const prompt = {
    action: "simulate_patient",
    data: {
      introduction_and_rapport_building: {
        greeting:
          "The student initiates the conversation with a friendly and professional greeting.",
        introduction:
          "The student introduces themselves and explains their role clearly.",
        establishing_comfort:
          "The student asks open-ended questions to make the patient feel comfortable and encourages them to share their concerns.",
      },
      active_listening_and_empathy: {
        listening_skills:
          "The student demonstrates active listening by nodding, making eye contact (if applicable), and providing verbal acknowledgments.",
        empathy:
          "The student shows empathy by acknowledging the patient's feelings and concerns.",
        clarification:
          "The student asks clarifying questions to ensure they understand the patient's statements correctly.",
      },
      effective_questioning: {
        open_ended_questions:
          "The student uses open-ended questions to gather detailed information.",
        closed_ended_questions:
          "The student appropriately uses closed-ended questions to confirm specific details.",
        follow_up_questions:
          "The student asks follow-up questions to delve deeper into the patient's responses.",
      },
      information_gathering_and_summarization: {
        comprehensive_information:
          "The student gathers comprehensive information about the patient's symptoms, history, and other relevant details.",
        summarization:
          "The student periodically summarizes the information provided by the patient to ensure accuracy and understanding.",
        patient_perspective:
          "The student seeks to understand the patient's perspective and incorporates it into their understanding.",
      },
      communication_style_and_professionalism: {
        clarity:
          "The student communicates clearly and avoids using medical jargon.",
        tone: "The student maintains a professional and compassionate tone throughout the conversation.",
        respect:
          "The student shows respect for the patient’s opinions and concerns.",
      },
      conclusion_and_next_steps: {
        summarizing_the_session:
          "The student summarizes the key points of the conversation.",
        next_steps:
          "The student explains the next steps clearly and answers any remaining questions.",
        closing:
          "The student closes the conversation politely and thanks the patient for their time.",
      },
    },
    patient_profile: {
      name: caseData.name,
      age: caseData.patient_age,
      gender: caseData.patient_gender,
      main_complains: caseData.mainComplains.split("\n"),
      medications: caseData.medications.split("\n"),
      patient_history: caseData.patientHistory.split("\n"),
      family_history: caseData.familyHistory.split("\n"),
      tests: caseData.tests.split("\n"),
    },
    instructions: [
      "Understand the case and play the role of the patient (Mohammed).",
      "Do not provide any information unless the student asks a question.",
      "If the student asks about anything not related to the case, respond with 'I don't know.'",
      "Answer all questions as Mohammed using the provided information.",
    ],
  };

  const updatedHistory = [
    { role: "user", parts: [{ text }] },
    { role: "model", parts: [{ text: JSON.stringify(prompt) }] },
  ];

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: updatedHistory,
    });

    const result = await chatSession.sendMessage(text);

    const aiResponseText = processResponse(result.response);
    const aiResponse = {
      text: aiResponseText,
      confidence: 1,
      ai: true,
    };

    setTranscripts((prevTranscripts) => [...prevTranscripts, aiResponse]);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", parts: [{ text }] },
      { role: "model", parts: [{ text: aiResponseText }] },
    ]);
    // Call handleAudioFetch if necessary
    // handleAudioFetch(aiResponseText, caseData[1].patient_gender);

    return aiResponseText;
  } catch (error) {
    console.error("Error fetching AI response:", error);
  } finally {
    setIsLoading(false);
  }
};

const processResponse = (response: any) => {
  if (response.candidates && response.candidates.length > 0) {
    if (response.candidates.length > 1) {
      console.warn(
        `This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`
      );
    }
    const candidate = response.candidates[0];
    if (hadBadFinishReason(candidate)) {
      throw new Error(`${formatBlockErrorMessage(response)}`);
    }
    return getText(candidate);
  } else if (response.promptFeedback) {
    throw new Error(`Text not available. ${formatBlockErrorMessage(response)}`);
  }
  return "";
};

const hadBadFinishReason = (candidate: any) => {
  return false;
};

const formatBlockErrorMessage = (response: any) => {
  return "Blocked content";
};

const getText = (candidate: any) => {
  if (
    candidate.content &&
    candidate.content.parts &&
    candidate.content.parts.length > 0
  ) {
    return candidate.content.parts[0].text;
  }
  return candidate.text ? candidate.text() : "";
};
