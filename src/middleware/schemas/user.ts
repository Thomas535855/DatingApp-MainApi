import { z } from "zod";

export const createUserSchema = z.object({
    userData: z.object({
        firstName: z.string().nonempty("First name is required"),
        dateOfBirth: z.string().refine(date => !isNaN(Date.parse(date)), {
            message: "Valid date of birth is required",
        }),
        location: z.string().nullable().optional(),
        profilePicture: z.string().nullable().optional()
    }),
    genres: z.array(z.string()).min(0, "Genres must be an array of strings"),
});
