import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/** Routes that skip optional API-key auth (e.g. health checks). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
