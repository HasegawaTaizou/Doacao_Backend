const supertest = require("supertest");
const app = require("../app.js");

//HOSPITAL TESTS
describe("Integration Tests HOSPITAL", () => {
  //GET TESTS
  test("GET das estatísticas de um hospital", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/ratings"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ratingsStatistics");
    expect(response.body.ratingsStatistics).toBeInstanceOf(Object);
  });

  test("GET de um hospital que existe", async () => {
    const response = await supertest(app).get("/api/v1/hospital-data/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hospital");
    expect(response.body).toHaveProperty("address");
    expect(response.body.hospital).toBeInstanceOf(Object);
    expect(response.body.address).toBeInstanceOf(Object);
  });

  test("GET de um hospital que não existe", async () => {
    const response = await supertest(app).get("/api/v1/hospital-data/100");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("GET de todos hospitais", async () => {
    const response = await supertest(app).get("/api/v1/hospitals");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hospitals");
    expect(response.body.hospitals).toBeInstanceOf(Array);
  });

  test("GET dos agendamentos feitos no hospital quando existem", async () => {
    const response = await supertest(app).get("/api/v1/hospital/1/schedules");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedules");
    expect(response.body.schedules).toBeInstanceOf(Array);
  });

  test("GET dos agendamentos feitos no hospital quando não existem", async () => {
    const response = await supertest(app).get("/api/v1/hospital/100/schedules");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  //Ver quando o nao tem um hospital
  test("GET das estatísticas do hospital sobre agendamentos", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/schedules"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedulesStatistics");
    expect(response.body.schedulesStatistics).toBeInstanceOf(Object);
  });

  test("GET das estatísticas do hospital sobre avaliações quando o hospital existe", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/reviews"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reviewsStatistics");
    expect(response.body.reviewsStatistics).toBeInstanceOf(Array);
  });

  test("GET das estatísticas do hospital sobre avaliações quando o hospital não existe", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/100/statistics/reviews"
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  //POSTS TESTS
  

  //VER ESSA PARTE PARA VER COMO QUE FAZ QUANDO NAO TEM NENHUM
  //   test("GET de todos os hospitais quando não tem nenhum", async () => {
  //     const response = await supertest(app).get(
  //       "/api/v1/hospital-data/100"
  //     );

  //     expect(response.status).toBe(404);
  //     expect(response.body).toHaveProperty("message");
  //   });
});
