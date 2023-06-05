const { it, expect } = require("@jest/globals");
import { fetchRepoData, fetchUsers } from "../components/searchbar";

it("Должна вернуть цифрой количество репозиториев пользователя tristoshestoi", async () => {
  let check = await fetchRepoData("tristoshestoi");
  console.log(check);
  expect(check).toBe(4);
});
