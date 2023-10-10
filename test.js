const app = require('./app');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

describe('API Routes', () => {
  // Define a sample record for testing
  const newRecord = {
    name: "John Doe",
    salary: 100000,
    department: "HR",
    sub_department: "Recruitment"
  };

  it('should add a new record', (done) => {
    request(app)
      .post('/add-record')
      .send(newRecord)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('Record added successfully');
        done();
      });
  });

  it('should delete a record', (done) => {
    // Assuming you have an existing record to delete
    request(app)
      .delete('/delete-record/:recordId') // Replace :recordId with an actual ID
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Record deleted successfully');
        done();
      });
  });

  it('should get summary statistics on salary (entire dataset)', (done) => {
    request(app)
      .get('/summary-salary')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('mean');
        expect(res.body).to.have.property('min');
        expect(res.body).to.have.property('max');
        done();
      });
  });

  it('should get summary statistics on salary for "on_contract": "true"', (done) => {
    request(app)
      .get('/on-contract')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('mean');
        expect(res.body).to.have.property('min');
        expect(res.body).to.have.property('max');
        done();
      });
  });

  it('should get summary statistics on salary by department', (done) => {
    request(app)
      .get('/by-department')
      .expect(200)
      .end((err, res) => {
        // Replace 'HR' with an actual department in your dataset
        expect(res.body).to.have.property('HR');
        expect(res.body['HR']).to.have.property('mean');
        expect(res.body['HR']).to.have.property('min');
        expect(res.body['HR']).to.have.property('max');
        done();
      });
  });

  it('should get summary statistics on salary by department and sub-department', (done) => {
    request(app)
      .get('/subdepartment-summary')
      .expect(200)
      .end((err, res) => {
        // Replace 'HR' and 'Recruitment' with actual department and sub-department
        expect(res.body).to.have.property('HR');
        expect(res.body['HR']).to.have.property('Recruitment');
        expect(res.body['HR']['Recruitment']).to.have.property('mean');
        expect(res.body['HR']['Recruitment']).to.have.property('min');
        expect(res.body['HR']['Recruitment']).to.have.property('max');
        done();
      });
  });
});
