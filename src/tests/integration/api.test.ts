import {app} from "../../index";

import chai from "chai";

import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

describe('API Integration Tests', () => {
  it('should return 200 for the health check route', async () => {
    const res = await chai.request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'ok');
  });
});
