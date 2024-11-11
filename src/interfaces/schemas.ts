export interface createUserSchema {
    userData: {
        firstName: string,
        dateOfBirth: Date,
        location: string;
        profilePicture
    },
    genres: string[];
}