import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', function() {
  let queue;

  beforeEach(function() {
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  afterEach(function() {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should throw an error if jobs is not an array', function() {
    expect(() => createPushNotificationsJobs('not an array', queue)).to.throw('Jobs is not an array');
  });

  it('should create two new jobs in the queue', function(done) {
    const jobs = [
      {
        phoneNumber: '4153518734',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518712',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    setImmediate(() => {
      const jobsInQueue = queue.testMode.jobs;
      expect(jobsInQueue).to.have.lengthOf(2);
      expect(jobsInQueue[0].type).to.equal('push_notification_code_3');
      expect(jobsInQueue[0].data).to.deep.equal(jobs[0]);
      expect(jobsInQueue[1].type).to.equal('push_notification_code_3');
      expect(jobsInQueue[1].data).to.deep.equal(jobs[1]);
      done();
    });
  });
});
