import {z} from 'zod'

//zod is used for backend data validation, eliminated manual task of validating each field

export const usernameValidation = z
    .string()
    .min(2, "Username must be alteast 2 characters")
    .max(20, "Username must be atmax 20 characters" )
    .regex( /^[a-zA-Z0-9_]+$/ , "Usename should not contain speccial characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be atleast 8 characters long"})
})