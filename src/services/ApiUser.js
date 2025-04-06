import axios from "axios";

const apiurl = "http://localhost:5000/users";

export async function getAllUsers() {
  return await axios.get(`${apiurl}/getAllUsers`);
}