import app from './app';
import { config } from './config';

const port = config.PORT;
app.listen(port, () => {
  console.log(`Image Processing API running on http://localhost:${port}`);
});
