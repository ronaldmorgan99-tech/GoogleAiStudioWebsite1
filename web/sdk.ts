import { z } from 'zod';
import safeJson from './utils/safeJson';

const API_BASE = '/api'; // Uses Vite proxy

// --- Zod Schemas for API Response Validation ---

const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    isStaff: z.boolean(),
    avatarUrl: z.string().nullable().optional(),
});

const lastPostSchema = z.object({
    title: z.string(),
    authorName: z.string(),
    authorIsStaff: z.boolean(),
    timestamp: z.string(), // ISO string
}).nullable();

const forumSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    threads: z.number(),
    posts: z.number(),
    lastPost: lastPostSchema,
    icon: z.string(),
});

const forumCategorySchema = z.object({
    id: z.string(),
    title: z.string(),
    forums: z.array(forumSchema),
});

const recentPostSchema = z.object({
    title: z.string(),
    authorName: z.string(),
    authorIsStaff: z.boolean(),
    timestamp: z.string(), // ISO string
});

const forumStatsSchema = z.object({
    threads: z.number(),
    posts: z.number(),
    members: z.number(),
});

const forumsHomepageResponseSchema = z.object({
    categories: z.array(forumCategorySchema),
    recentPosts: z.array(recentPostSchema),
    stats: forumStatsSchema,
    staffOnline: z.array(userSchema),
    membersOnline: z.array(userSchema),
});

export type ForumsHomepageData = z.infer<typeof forumsHomepageResponseSchema>;

// --- API Client ---

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema: z.ZodType<T>
  ): Promise<T> {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // Send cookies
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);

      const parsed = await safeJson(response);

      if (!response.ok) {
        const errorData: any = parsed ?? { detail: response.statusText };
        console.error('API Error:', errorData);
        throw new Error(errorData.detail || 'An API error occurred');
      }

      if (parsed === null) {
        return null as unknown as T;
      }

      return schema.parse(parsed); // Validate and return
    } catch (error) {
      console.error(`Request failed for endpoint: ${endpoint}`, error);
      if (error instanceof z.ZodError) {
          throw new Error(`API response validation failed: ${error.message}`);
      }
      throw error;
    }
  }
  
  // --- Public Methods ---

  public getForumsHomepage(): Promise<ForumsHomepageData> {
    return this.request('/forums', {}, forumsHomepageResponseSchema);
  }

  // Example of another method
  // public async getThreads(forumId: string, cursor?: string): Promise<any> {
  //   const url = `/forums/${forumId}/threads?limit=20${cursor ? `&cursor=${cursor}` : ''}`;
  //   return this.request(url, {}, someThreadSchema);
  // }
}

export const api = new ApiClient();