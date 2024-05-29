const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios');
const timeout = require('connect-timeout');
const mysql = require('mysql');
// 创建一个 MySQL 连接配置对象
// const connection = mysql.createConnection({
//     host: '34.210.141.37', // 数据库服务器地址
//     user: 'sqlprostudio-ro', // 数据库用户名
//     password: '123456', // 数据库密码
//     database: 'Northwind' // 数据库名称
//   });
  
//   // 连接到 MySQL 数据库
//   connection.connect(function(err) {
//     if (err) {
//       console.error('连接失败:', err);
//       return;
//     }
//     console.log('连接成功');
    
//   });
  
//   // 执行 SQL 查询
//   connection.query('SELECT * FROM Customers', function(err, rows, fields) {
//     if (err) {
//       console.error('执行 SQL 查询失败:', err);
//       return;
//     }
//     rows.forEach(function(row) {
//       console.log(row);
//     });
//   });
  
//   // 关闭连接
//   connection.end();

// 设置全局超时时间为 10 秒
app.use(timeout('60s'));

// 或者，你可以设置更精细的 CORS 策略
app.use(cors({
  origin: 'http://localhost:4399', // 允许来自特定源的请求
  methods: 'GET,POST,PUT,DELETE', // 允许的 HTTP 请求方法
  allowedHeaders: 'Content-Type, Authorization', // 允许的 HTTP 请求头
}))
app.use(express.json())


async function getAccessToken() {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Kw7QkUTv1kAoVHy4RHPLt6OH&client_secret=MEXVxD1dYaIlfzumlQQhJBTriMHNWRsy`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

app.post("/api/chatgpt",async (req,res)=>{
    const { messages } = req.body
    
    messages.shift()
    if(messages.length===1){
        messages[0].content= "CREATE TABLE IF NOT EXISTS 'users' ('id' INT NOT NULL AUTO_INCREMENT,'username' VARCHAR(50) NOT NULL,'password' VARCHAR(50) NOT NULL,'email' VARCHAR(100),'create_time' DATETIME DEFAULT CURRENT_TIMESTAMP,'update_time' DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY ('id'),UNIQUE KEY 'username_UNIQUE' ('username'),UNIQUE KEY 'email_UNIQUE' ('email')) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;这是我的数据库中用表的创建方式，"
        +"这是用户的需求:"+messages[0].content
        +",请根据用户的需求生成sql语句，回答内容仅仅包含sql语句用[]包裹，格式如['sql string']，不要有多余的解释和描述"
    }
    //console.log('messages',messages)
    try {
        const accessToken = await getAccessToken();
        const apiUrl = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token=${accessToken}`;

        const response = await axios.post(apiUrl, {
            messages:messages
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('response.data',response.data.result)
        const jsonString = response.data.result.replace(/'/g, '"');
        const sql = JSON.parse(jsonString)[0]
        console.log('response.data',sql)
        res.json({
            status: 'success',
            data: response.data
          });
    } catch (error) {
        console.error('Error in main function:', error);
        res.json({
            status: 'error'
          });
    }
})




app.listen(3000,()=>{
    console.log("Server started on port 3000")
})