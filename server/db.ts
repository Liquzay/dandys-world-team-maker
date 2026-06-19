import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProfiles, InsertUserProfile, runs, InsertRun, communityLayouts, InsertCommunityLayout, customToons, InsertCustomToon, customTrinkets, InsertCustomTrinket } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// User Profile functions
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserProfile(userId: number, profile: Omit<InsertUserProfile, 'userId'>) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userProfiles).values({ ...profile, userId }).onDuplicateKeyUpdate({
    set: profile,
  });
}

// Runs functions
export async function getUserRuns(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(runs).where(eq(runs.userId, userId)).orderBy(desc(runs.createdAt));
}

export async function createRun(run: InsertRun) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(runs).values(run);
  return result;
}

export async function updateRun(runId: number, updates: Partial<Omit<InsertRun, 'userId'>>) {
  const db = await getDb();
  if (!db) return;
  await db.update(runs).set(updates).where(eq(runs.id, runId));
}

export async function deleteRun(runId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(runs).where(eq(runs.id, runId));
}

// Community Layouts functions
export async function getCommunityLayouts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(communityLayouts).orderBy(desc(communityLayouts.likes)).limit(limit).offset(offset);
}

export async function createCommunityLayout(layout: InsertCommunityLayout) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(communityLayouts).values(layout);
  return result;
}

export async function likeCommunityLayout(layoutId: number) {
  const db = await getDb();
  if (!db) return;
  const layout = await db.select().from(communityLayouts).where(eq(communityLayouts.id, layoutId)).limit(1);
  if (layout.length > 0) {
    await db.update(communityLayouts).set({ likes: layout[0].likes + 1 }).where(eq(communityLayouts.id, layoutId));
  }
}

// Custom Toons functions
export async function getUserCustomToons(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(customToons).where(eq(customToons.userId, userId)).orderBy(desc(customToons.createdAt));
}

export async function createCustomToon(toon: InsertCustomToon) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(customToons).values(toon);
  return result;
}

export async function deleteCustomToon(toonId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(customToons).where(eq(customToons.id, toonId) && eq(customToons.userId, userId));
}

// Custom Trinkets functions
export async function getUserCustomTrinkets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(customTrinkets).where(eq(customTrinkets.userId, userId)).orderBy(desc(customTrinkets.createdAt));
}

export async function createCustomTrinket(trinket: InsertCustomTrinket) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(customTrinkets).values(trinket);
  return result;
}

export async function deleteCustomTrinket(trinketId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(customTrinkets).where(eq(customTrinkets.id, trinketId) && eq(customTrinkets.userId, userId));
}
