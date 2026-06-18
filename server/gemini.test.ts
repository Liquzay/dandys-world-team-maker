import { describe, it, expect } from "vitest";
import { invokeLLM } from "./_core/llm";

describe("Gemini API Integration", () => {
  it("should successfully call Gemini API with team generation prompt", async () => {
    const response = await invokeLLM({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: "You are a Dandy's World team builder. Respond with valid JSON only.",
        },
        {
          role: "user",
          content: `Generate a simple team with 1 Toon and 0 trinkets. Respond ONLY with this JSON format:
{
  "team": [
    {
      "toonName": "Astro",
      "count": 1,
      "trinkets": []
    }
  ]
}`,
        },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0]?.message).toBeDefined();
    expect(response.choices[0]?.message.content).toBeDefined();

    const content = response.choices[0]?.message.content;
    expect(typeof content).toBe("string");
    expect(content).toContain("Astro");
  });
});
