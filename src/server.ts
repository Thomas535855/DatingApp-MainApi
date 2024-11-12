import { app } from './index';
import { AppDataSource } from './data-source';

if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Error during Data Source initialization:', error);
    });
}
