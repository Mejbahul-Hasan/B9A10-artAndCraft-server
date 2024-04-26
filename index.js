const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res)=>{
    res.send('ART & CRAFT SERVER IS RUNNING')
})
app.listen(port, ()=>{
    console.log(`Art and Craft server is running on port: ${port}`)
})