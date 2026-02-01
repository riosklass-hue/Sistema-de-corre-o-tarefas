
import { GoogleGenAI, Type } from "@google/genai";
import { AIGradeResponse, Rubric, Assignment, Submission } from "../types";

// Inicialização centralizada
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRubric = async (assignmentTitle: string, assignmentDescription: string): Promise<Rubric> => {
  const model = "gemini-3-pro-preview"; // Tarefa complexa de design instrucional
  
  const systemInstruction = `
    Você é um Pedagogo especialista em Ensino Técnico em Administração e Design Instrucional.
    Sua tarefa é criar rubricas de avaliação detalhadas e pedagógicas para tarefas de alunos.
    As rubricas devem ser justas, claras e alinhadas com as competências do mercado de trabalho.
  `;

  const prompt = `
    Crie uma rubrica de avaliação para a seguinte tarefa:
    Título: ${assignmentTitle}
    Descrição: ${assignmentDescription}

    A rubrica deve ter pelo menos 3 critérios (ex: Domínio Técnico, Clareza, Aplicação Prática).
    Cada critério deve ter 4 níveis: Excelente (100% da nota), Bom (70%), Regular (40%), Insuficiente (0%).
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
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          criteria: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                levels: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["score", "title", "description"]
                  }
                }
              },
              required: ["id", "title", "description", "levels"]
            }
          }
        },
        required: ["id", "name", "criteria"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const correctAssignment = async (
  assignment: Assignment,
  submission: Submission,
  rubric: Rubric
): Promise<AIGradeResponse> => {
  const model = "gemini-3-pro-preview"; // Tarefa complexa de raciocínio pedagógico
  
  const systemInstruction = `
    Você é um Arquiteto de Software Educacional e Pedagogo especialista em Ensino Técnico em Administração.
    Sua tarefa é avaliar respostas de alunos baseando-se em rubricas específicas e nos objetivos de aprendizagem do curso técnico.
    
    CRITÉRIOS TÉCNICOS DE ADMINISTRAÇÃO:
    - Uso correto de terminologia (ex: SWOT, PDCA, Fluxogramas).
    - Visão sistêmica e ética profissional.
    - Clareza na comunicação empresarial.
    - Capacidade de resolução de problemas práticos.

    Seja encorajador mas rigoroso com a técnica. Retorne um JSON estritamente no formato solicitado.
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

  return JSON.parse(response.text || "{}");
};

export const createChat = (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview', // Kleo precisa de alto nível de raciocínio
    config: {
      systemInstruction,
    },
  });
};

export const getFastInsight = async (assignmentTitle: string, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest', // Resposta ultra rápida e econômica
    contents: `Dê uma dica ultra-rápida (máximo 15 palavras) para o professor sobre como abordar pedagogicamente esta tarefa: "${assignmentTitle}" - ${description}`,
  });
  return response.text || "";
};

export const getDetailedInsight = async (assignmentTitle: string, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Equilíbrio entre velocidade e qualidade
    contents: `Como um especialista em educação técnica em administração, forneça uma análise pedagógica detalhada (cerca de 80-100 palavras) sobre como o professor pode abordar e avaliar esta tarefa da melhor forma possível. Foque em competências práticas e visão de mercado. Tarefa: "${assignmentTitle}" - ${description}`,
  });
  return response.text || "";
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return "";
};

export const analyzeImage = async (base64: string, mimeType: string, prompt: string): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64,
          },
        },
        { text: prompt },
      ],
    },
  });
  return response.text || "";
};

export const searchGrounding = async (query: string): Promise<{ text: string; sources: any[] }> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};
