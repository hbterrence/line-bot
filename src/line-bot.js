import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import config from '../config';
import response from 'response';

const app = express();
const port = '7123';
const { CHANNEL_ID, CHANNEL_SERECT, MID } = {...config};
const LINE_API = 'https://trialbot-api.line.me/v1/events';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/callback', (req, res) => {
  const result = req.body.result;
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();

  for(let i=0; i<result.length; i++){
    const data = result[i]['content'];
    console.log('receive: ', data);
    sendTextMessage(data.from, data.text);
  }
});

app.listen(port, () => console.log(`listening on port ${port}`));

function sendTextMessage(sender, text) {

  const data = {
    to: [sender],
    toChannel: 1383378250,
    eventType: '138311608800106203',
    content: {
      contentType: 1,
      toType: 1,
      text: text
    }
  };

  console.log('send: ', data);

  request({
    url: LINE_API,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Line-ChannelID': CHANNEL_ID,
      'X-Line-ChannelSecret': CHANNEL_SERECT,
      'X-Line-Trusted-User-With-ACL': MID
    },
    method: 'POST',
    body: JSON.stringify(data) 
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    console.log('send response: ', body);
  });
}
