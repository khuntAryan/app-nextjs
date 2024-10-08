import conf from "@/conf/config";
import {Client, Account, ID} from 'appwrite'

type CreateUserAccount = {
    email: string,
    password: string,
    name: string,
}

type LoginUserAccount = {
    email: string,
    password: string,
}

const appwriteClient = new Client()

appwriteClient.setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);

export const account = new Account(appwriteClient)

export class AppwriteService {
    //create a new record of user inside appwrite
    async createUserAccount({email, password, name}: CreateUserAccount) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name)
            if (userAccount) {
                return this.login({email, password})
            } else {
                return userAccount
            }    
        } catch (error:any) {
            throw error
        }

    
    }

    async login({ email, password }: LoginUserAccount) {
        try {
            // Attempt to create an email session
            return await account.createEmailPasswordSession(email, password);
        } catch (error: any) {
            console.error("Login failed:", error.message); // Log error for debugging
            throw new Error("Login failed. Please check your credentials and try again.");
        }
    }
    

    async isLoggedIn(): Promise<boolean> {
        try {
            const data = await this.getCurrentUser();
            return Boolean(data)
        } catch (error) {}

        return false
    }

    async getCurrentUser() {
        try {
            return account.get()
        } catch (error) {
            console.log("getcurrentUser error: " + error)
            
        }

        return null
    }

    async logout() {
        try {
            return await account.deleteSession("current")
        } catch (error) {
            console.log("logout error: " + error)
        }
    }

    
}

const appwriteService = new AppwriteService()

export default appwriteService