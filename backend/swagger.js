import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'https://clubsphere-o0xb.onrender.com'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/userRoute.js', './routes/eventRoute.js','./routes/fileRoute.js','./routes/memberRoute.js','./routes/optRoute.js','./routes/paymentRoute.js','./routes/postRoute.js','./routes/votingRoute.js'];



swaggerAutogen()(outputFile, routes, doc);