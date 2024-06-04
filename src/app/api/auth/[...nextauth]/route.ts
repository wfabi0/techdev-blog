import { handlers } from "@/modules/auth/auth";

export const runtime = "edge";

export const { GET, POST } = handlers;
