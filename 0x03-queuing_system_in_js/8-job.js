export default function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) throw Error('Jobs is not an array');
    jobs.forEach((jobData) => {
      const job = queue.create('push_notification_code_3', jobData);
      job.save((err) => {
        if (err) {
          console.error(`Error saving job: ${err}`);
          return;
        }
        console.log(`Notification job created: ${job.id}`);
      });
      job.on('complete', () => {
        console.log(`Notification job ${job.id} completed`);
      }).on('failed', (err) => {
        console.log(`Notification job ${job.id} failed: ${err}`);
      }).on('progress', (progress) => {
        console.log(`Notification job ${job.id} ${progress} complete`);
      });
    });
  }
