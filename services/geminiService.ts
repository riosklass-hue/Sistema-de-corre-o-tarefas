
import { GoogleGenAI, Type } from "@google/genai";
import { AIGradeResponse, Rubric, Assignment, Submission } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const correctAssignment = async (
  assignment: Assignment,
  submission: Submission,
  rubric: Rubric
): Promise<AIGradeResponse> => {
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    Você é um Arquiteto de Software Educacional e Pedagogo especialista em Ensino Técnico em Administração.
    Sua tarefa é avaliar respostas de alunos baseando-se em rubricas específicas e nos objetivos de aprendizagem do curso técnico.
    
    CRITÉRIOS TÉCNICOS DE ADMINISTRAÇÃO:
    - Uso correto de terminologia (ex: SWOT, PDCA, Fluxogramas).
    - Visão sistêmica e ética profissional.
    - Clareza na comunicação empresarial.
    - Capacidade de resolução de problemas práticos.

    Você deve retornar um JSON estritamente no formato solicitado.
  `;

  const prompt = `
    Tarefa: ${assignment.title}
    Descrição da Tarefa: ${assignment.description || 'N/A'}
    Rubrica de Avaliação: ${JSON.stringify(rubric)}
    Resposta do Aluno: ${submission.studentResponse}
    Pontuação Máxima: ${assignment.maxPoints}

    Avalie a resposta e gere a nota, feedback pedagógico e sugestões de melhoria.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "A nota final calculada com base na rubrica." },
          pedagogicalFeedback: { type: Type.STRING, description: "Feedback detalhado e construtivo." },
          improvementSuggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista de pontos onde o aluno pode melhorar."
          },
          justification: { type: Type.STRING, description: "Breve justificativa técnica da nota para o professor." }
        },
        required: ["score", "pedagogicalFeedback", "improvementSuggestions", "justification"]
      }
    }
  });

  return JSON.parse(response.text);
};

// Chatbot help using gemini-3-pro-preview
export const createChat = (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    },
  });
};

// Image Generation using gemini-3-pro-image-preview
export const generateImage = async (prompt: string, aspectRatio: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: `Crie uma imagem educacional profissional para um curso técnico de administração: ${prompt}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// Image Analysis using gemini-3-pro-preview
export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: `Como um arquiteto de software educacional, analise esta imagem técnica e responda: ${prompt}` }
      ]
    }
  });
  return response.text;
};

// Search Grounding using gemini-3-flash-preview
export const searchGrounding = async (query: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Pesquise e explique conceitos atuais de administração aplicados a: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// Low-latency response using gemini-2.5-flash-lite
export const getFastInsight = async (assignmentTitle: string, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: `Dê uma dica ultra-rápida (máximo 15 palavras) para o professor sobre como abordar pedagogicamente esta tarefa: "${assignmentTitle}" - ${description}`,
  });
  return response.text;
};
