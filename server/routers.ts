import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { TOONS, TRINKETS } from "../client/src/data/characters";
import { getUserProfile, upsertUserProfile, getUserRuns, createRun, updateRun, deleteRun, getCommunityLayouts, createCommunityLayout, likeCommunityLayout, getUserCustomToons, createCustomToon, deleteCustomToon, getUserCustomTrinkets, createCustomTrinket, deleteCustomTrinket } from "./db";

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

        const mainCharacters = ["Astro", "Pebble", "Shelly", "Sprout", "Vee", "Bassie", "Bobette", "Gourdy"];
        
        const prompt = `You are an expert Dandy's World team builder. You have knowledge of real player strategies from the Dandy's World community.

MAIN CHARACTERS (prioritize these): ${mainCharacters.join(", ")}
All Available Toons: ${toonNames.join(", ")}
All Available Trinkets: ${trinketNames.join(", ")}

User's request: "${input.description}"

Based on your knowledge of Dandy's World community strategies and meta teams:
1. Generate a team with 3-5 different Toons (each can appear 1-8 times)
2. Prioritize main characters when appropriate
3. Each Toon should have 0-2 trinkets
4. Use real team strategies and synergies from the Dandy's World community
5. Make the team match the user's description while being strategically sound

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

  // User profile management
  profile: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getUserProfile(ctx.user.id);
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        robloxUsername: z.string().min(1, "Roblox username required"),
        privateServerLink: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertUserProfile(ctx.user.id, {
          robloxUsername: input.robloxUsername,
          privateServerLink: input.privateServerLink,
        });
        return { success: true };
      }),
  }),

  // Runs management
  runs: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserRuns(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1, "Run name required"),
        description: z.string().min(1, "Run description required"),
        teamData: z.string(),
        isPublic: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createRun({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          teamData: input.teamData,
          isPublic: input.isPublic ? 1 : 0,
        });
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        runId: z.number(),
        isPublic: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateRun(input.runId, {
          isPublic: input.isPublic ? 1 : 0,
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ runId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteRun(input.runId);
        return { success: true };
      }),
  }),

  // Community layouts
  community: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await getCommunityLayouts(input.limit, input.offset);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        team: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        // First create a run
        const run = await createRun({
          userId: ctx.user.id,
          name: input.name,
          description: input.description || "",
          teamData: JSON.stringify(input.team),
          isPublic: 1,
        });
        
        if (!run) {
          throw new Error("Failed to create run");
        }
        
        // Get the inserted ID from the result
        const runId = (run as any).insertId || (run as any)[0];
        
        // Then create a community layout pointing to that run
        return await createCommunityLayout({
          userId: ctx.user.id,
          runId: runId,
          name: input.name,
          description: input.description || "",
          teamData: JSON.stringify(input.team),
        });
      }),
    like: publicProcedure
      .input(z.object({ layoutId: z.number() }))
      .mutation(async ({ input }) => {
        await likeCommunityLayout(input.layoutId);
        return { success: true };
      }),
  }),

  customToons: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUserCustomToons(ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createCustomToon({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ toonId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteCustomToon(input.toonId, ctx.user.id);
        return { success: true };
      }),
  }),

  customTrinkets: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUserCustomTrinkets(ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        category: z.string(),
        rarity: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createCustomTrinket({
          userId: ctx.user.id,
          name: input.name,
          category: input.category,
          rarity: input.rarity,
          description: input.description,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ trinketId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteCustomTrinket(input.trinketId, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
