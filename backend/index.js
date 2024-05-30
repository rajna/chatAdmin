const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios');
const timeout = require('connect-timeout');
const mysql = require('mysql');

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
    let { messages } = req.body
    
    messages = [messages[messages.length-1]]
    if(messages.length===1){
        messages[0].content= "CREATE TABLE `question` (`id` int(11) NOT NULL AUTO_INCREMENT,`uid` varchar(255) NOT NULL COMMENT '用户id',`create_time` datetime DEFAULT NULL COMMENT '创建时间',`status` tinyint(4) DEFAULT NULL COMMENT '保留字段',`score` int(11) DEFAULT NULL COMMENT '回答得分',`isai` tinyint(4) DEFAULT NULL COMMENT '1是ai 0不是ai',`question` varchar(10000) DEFAULT NULL COMMENT '问题',`answer` varchar(5000) DEFAULT NULL COMMENT '答案',`feedback` varchar(255) DEFAULT NULL COMMENT '反馈',`prompt` varchar(255) DEFAULT NULL COMMENT 'prompt',PRIMARY KEY (`id`))这是我的数据库中用表的创建方式，"
        +"这是用户的需求:"+messages[0].content
        +",请根据用户的需求生成sql语句，think step by step,回答内容仅仅包含sql语句用[]包裹，格式如['sql string']，不要有多余的解释和描述,这对我的职业生涯很重要"
    }
    console.log('messages',messages)
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
        console.log('response.data.result',response.data.result)
        const jsonString = response.data.result.replace(/'/g, '"');
        
        const sql = JSON.parse(jsonString)[0]

        const connection = mysql.createConnection({
           
          });
    
            // 连接到 MySQL 数据库
        connection.connect(function(err) {
            if (err) {
            console.error('连接失败:', err);
            return;
            }
            console.log('连接成功');
            // 执行 SQL 查询
            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    console.error('执行 SQL 查询失败:', err);
                    res.json({
                        status: 'error'
                    });
                    return;
                }
                
                res.json({
                    status: 'success',
                    dateType: "table",
                    result: sql,
                    data: rows
                });
            });
            
            // 关闭连接
            connection.end();
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