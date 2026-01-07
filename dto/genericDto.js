import * as z from "zod";

export const userDto = z.object({ username: z.string() });
