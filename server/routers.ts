import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { TOONS, TRINKETS } from "../client/src/data/characters";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Team generator with AI
  team: router({
    generateRandomTeam: publicProcedure
      .input(z.object({
        description: z.string().describe("User's description of the team they want"),
      }))
      .mutation(async ({ input }) => {
        const toonNames = TOONS.map(t => t.name);
        const trinketNames = TRINKETS.map(t => t.name);

        const prompt = `You are a Dandy's World team builder assistant. Based on the user's description, generate a random team composition.

Available Toons: ${toonNames.join(", ")}
Available Trinkets: ${trinketNames.join(", ")}

User's request: "${input.description}"

Generate a team with:
1. 3-5 different Toons (each Toon can appear 1-8 times)
2. Each Toon should have 0-2 trinkets
3. Make the team thematic and fun based on the user's description

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "team": [
    {
      "toonName": "Toon Name",
      "count": 1,
      "trinkets": ["Trinket Name 1", "Trinket Name 2"]
    }
  ]
}

Ensure all Toon and Trinket names match exactly from the lists above.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a helpful Dandy's World team builder. Always respond with valid JSON only." },
            { role: "user", content: prompt },
          ],
        });

        let content = response.choices[0]?.message.content || "";
        
        // Handle case where content is an array
        if (Array.isArray(content)) {
          content = content.map(c => typeof c === 'string' ? c : (c as any).text || '').join('');
        }
        
        // Parse the JSON response
        let parsedTeam;
        try {
          parsedTeam = JSON.parse(content as string);
        } catch (e) {
          // Try to extract JSON from the response
          const jsonMatch = (content as string).match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedTeam = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Failed to parse AI response");
          }
        }

        // Validate and map the team
        const validatedTeam = parsedTeam.team.map((item: any) => {
          const toon = TOONS.find(t => t.name === item.toonName);
          if (!toon) throw new Error(`Invalid Toon: ${item.toonName}`);

          const trinkets = (item.trinkets || []).map((trinketName: string) => {
            const trinket = TRINKETS.find(t => t.name === trinketName);
            if (!trinket) throw new Error(`Invalid Trinket: ${trinketName}`);
            return trinket.id;
          });

          return {
            toonId: toon.id,
            toonName: toon.name,
            trinkets: trinkets.slice(0, 2), // Max 2 trinkets
            count: Math.min(Math.max(item.count || 1, 1), 8), // 1-8x
          };
        });

        return {
          team: validatedTeam,
          description: input.description,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
