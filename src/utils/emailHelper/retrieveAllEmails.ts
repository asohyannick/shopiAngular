import Auth from "../../models/auth/auth.model";
const fetchAllUserEmails = async(): Promise<string []> => {
try {
    const users = await Auth.find({});
   return users.map(user => user.email)
} catch (error) {
  console.log('Error occur while fetching emails');
  throw new Error("Something went wrong");
}
}
export default fetchAllUserEmails;

