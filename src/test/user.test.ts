import * as supertest from "supertest";

const request = supertest('localhost:3000');


describe("User API", () => {
  it("should get all users", async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });

  it("should get user detail", async () => {
    const response = await request.get('/users/1');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });

  it("should create a new user", async () => {
    const response = await request.post('/users').send({
        "firstname": "Anti",
        "lastname": "Mage",
        "birthdate": "2023-10-01",
        "email": "timber@example.com",
        "timezone": "Asia/Jakarta"
    });
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });

  it("should update a user", async () => {
    const response = await request.patch('/users/12').send({
        "firstname": "Anti",
        "lastname": "Mage",
        "birthdate": "2023-10-01",
        "email": "timber@example.com",
        "timezone": "Asia/Jakarta"
    });
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });

  it("should delete a user", async () => {
    const response = await request.delete('/users/17');
    expect(response.status).toBe(200);
  });
});
