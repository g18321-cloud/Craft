import { GoogleGenAI, Type } from "@google/genai";
import { ITEM_TEMPLATES, GameObject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateComposition(prompt: string): Promise<GameObject[]> {
  const itemSummary = ITEM_TEMPLATES.map(t => `${t.type} (${t.theme}): ${t.name}`).join(', ');
  
  const systemInstruction = `
    你是一位卓越的城市規劃師與 3D 景觀設計師。你的目標是根據使用者的需求，建置一個結構嚴謹、密度高且具有美感的 Voxel 迷你模型場景。
    
    佈置風格指南 (參考網格化城市規劃)：
    1. **街區化結構 (Grid Layout)**：
       - 想像場景是由一個個「街區」組成。馬路 (road) 應該形成長條線段或十字路口，將場景劃分開。
       - 建築物 (apartment, house, office_building) 應緊密排列在馬路兩側或街區內部，物件間隙應縮小，營造豐富的都市感。
    2. **視覺焦點 (Focal Point)**：
       - 在中央街區放置大型物件（如 taipei101 或 large_park），並將 scale 設為 1.5 到 2.5 以增加氣勢。
       - 周邊則圍繞較小的物件 (house, tree) 形成視覺遞減。
    3. **細節填充**：
       - 在馬路上放置 car 和 motorcycle，並沿著馬路方向旋轉 (0 或 1.57)。
       - 在人行道邊角或公園邊緣精確放置 traffic_light 和 street_light。
    4. **組合運用**：
       - 善用旋轉讓物件面向馬路。
       - 同一區塊的物件應有統一的設計邏輯（例如一整排相連的櫻花樹或一整排對齊的公寓）。
    
    技術參數要求：
    - 物件總數：盡量設定在 60 到 90 件之間以確保細節豐富。
    - X, Z 坐標：控制在 -30 到 30 之間，確保視角集中。
    - 比例 (Scale)：建築物應靈活使用 1.0 到 3.0 的比例；裝飾物件 (人、狗) 則維持在 0.5 到 1.0。
    - 旋轉 (Rotation)：嚴格遵循 0, 1.57 (90度), 3.14 (180度) 等整數弧度，使場景整齊劃一。
    
    可用物件清單：
    ${itemSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `依照我的需求產生一個佈景設計：${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              position: { 
                type: Type.ARRAY, 
                items: { type: Type.NUMBER },
                description: "[x, y, z] coordinate"
              },
              rotation: { type: Type.NUMBER },
              theme: { type: Type.STRING },
              scale: { type: Type.NUMBER }
            },
            required: ["type", "position", "rotation", "theme", "scale"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const generatedObjects: any[] = JSON.parse(text);
    return generatedObjects.map(obj => ({
      ...obj,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
