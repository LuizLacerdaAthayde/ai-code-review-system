import { api } from "./api";
import type {ReviewDoc} from "../types/review";

export async function submitReview(code: string, language: string) {
  const { data } = await api.post<{ id: string; status: string }>("/reviews", { code, language });
  return data;
}

export async function fetchReview(id: string) {
  const { data } = await api.get<ReviewDoc>(`/reviews/${id}`);
  return data;
}

export async function listReviews(params?: { language?: string; page?: number; page_size?: number; min_score?: number }) {
  const { data } = await api.get<{ items: ReviewDoc[]; page: number; page_size: number }>("/reviews", { params });
  return data;
}

export async function fetchStats() {
  const { data } = await api.get<{ avgScore: number | null; total: number }>("/stats");
  return data;
}