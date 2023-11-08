const supertest = require("supertest");
const app = require("../app.js");

//HOSPITAL TESTS
describe("Testes de Integração para GET /hospital/1/statistics/ratings", () => {
  test("GET /hospital/1/statistics/ratings", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/ratings"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ratingsStatistics");
    expect(response.body.ratingsStatistics).toBeInstanceOf(Object);
  });
});
