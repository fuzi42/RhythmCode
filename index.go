package main

import (
    "net/http"
    "fmt"
    "io"
    "os"
//  "encoding/json"
    "database/sql"
//  "github.com/gin-gonic/gin"
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
    _ "github.com/go-sql-driver/mysql"
    "time"
    "strings"
    "strconv"
    "github.com/dgrijalva/jwt-go"
    )
var (
	SIGN_NAME_SCERET = "aweQurt178BNI"
)
const IP_URL = "http://127.0.0.1:8000/"
//用户结构
type User struct{
    Name        string  `json:"name"`
    Password    string  `json:"password"`
    School      string  `json:"school"`
}
//card内容
type Card struct{
    // Id          string  `json:"id"`
    Title       string  `json:"title"`
    Image       string  `json:"image"`
    Video       string  `json:"video"`
    Message     string  `json:"message"`
    Kind        string  `json:"kind"`
}
//留言结构
type Comment struct{
    Card_id     string  `json:"card_id"`
    User_id     string  `json:"user_id"`
    Comments    string  `json:"comments"`
}
//注册功能
func zhuce(c echo.Context) (err error) {

        // var userinfo User
        user:=new(User)
        if err = c.Bind(user); err != nil {
            return c.JSON(http.StatusOK, "数据错误")
        }
        // fmt.Println(user.Name,user.Password)
        db,err:=opendb(c)      //连接数据库
        if err!=nil {
            return err
        }
        defer db.Close()    //关闭数据库
        id := time.Now().Unix()   //用户Id
        demoImage :="avatar/demo.jpg"
        db.Exec("insert into info(id,username,password,school,likes,collects,follows,userimages) values (?,?,?,?,'','','',?)",id,user.Name,user.Password,user.School,demoImage)     
        fmt.Println("注册成功！")
        resp :=map[string]string{"datas": "update successfully"}
        return c.JSON(http.StatusOK, resp)
    
}
//登陆功能
func denglu(c echo.Context) error{
   
    cookie,err :=c.Cookie("denglu")
    fmt.Println(cookie)
    if err != nil {
        user:=new(User)
        if err = c.Bind(user); err != nil {
            return c.JSON(http.StatusOK, "数据错误")
        }
        if user.Name!="" && user.Password !="" {
            db,err:=opendb(c)      //连接数据库
            if err!=nil {
            return err
            }
            defer db.Close()    //关闭数据库
        resp := map[string]string{"message": "登录失败！"}
        fmt.Println(user)
        result:=db.QueryRow("select password,id,userimages from info where username=?",user.Name)      //单行查询
        var password,id,userimage string
        result.Scan(&password,&id,&userimage)
        fmt.Println(result)
        if user.Password == password {
            tokenString, err := createJwt(id)
        if err != nil {
            fmt.Println(err.Error())
            return c.JSON(http.StatusOK, "token生成失败")
        }   
        cookie := new(http.Cookie)
        cookie.Name = "denglu"
        cookie.Value = tokenString
        cookie.Expires = time.Now().Add(24 * time.Hour)
        c.SetCookie(cookie)
        resp = map[string]string{"message": "登录成功！","name":user.Name,"userimage":userimage,"user_id":id,"token":tokenString}
        }
        
       return c.JSON(http.StatusOK, resp)
    }else{
        return c.JSON(http.StatusOK, "数据为空")
    }
    }else{
        fmt.Println(cookie)
        claims := parseJwt(cookie.Value)
        user_id  := claims["user_id"]
        if user_id =="expired" { 
            return delCookie(c)
        }
        db,err:=opendb(c)      //连接数据库
        if err!=nil {
        return err
        }
        defer db.Close()    //关闭数据库
        result:=db.QueryRow("select username,userimages,school,likes,collects,follows from info where id=?",user_id)      //单行查询
        var name,userimage,school,likes,collects,follows string
        result.Scan(&name,&userimage,&school,&likes,&collects,&follows)
        resp := map[string]string{"message": "登录成功！","user_id": user_id.(string),"name":name,"userimages":userimage,"school":school,"likes":likes,"collects":collects,"follows":follows}
       return c.JSON(http.StatusOK, resp)
    }
    
}
//上传功能
func upload(c echo.Context) error{
    cookie,err :=c.Cookie("denglu")
    if err != nil {return c.JSON(http.StatusOK, "wrong")}else{
        claims := parseJwt(cookie.Value)
        user_id  := claims["user_id"]
        if user_id =="expired" { 
            return delCookie(c)
        }
    act :=c.Param("what")
    if act =="image" {
        kind := c.QueryParam("kind")
        if kind == "avatar" {
        file, err := c.FormFile("img")
        if err != nil {
            return err
        }
        src, err := file.Open()
        if err != nil {
            return err
        }
        defer src.Close()
    
        // Destination
        dst, err := os.Create("./avatar/"+file.Filename)
        if err != nil {
            return err
        }
        defer dst.Close()
        // Copy
        if _, err = io.Copy(dst, src); err != nil {
            return err
        }else{
            db,err:=opendb(c)      //连接数据库
            if err!=nil {
            return err
            }
            defer db.Close()    //关闭数据库
            imageUrl :="avatar/"+file.Filename
            db.Exec("update info set userimages=? where id=?",imageUrl,user_id)      
            return c.JSON(http.StatusOK, "上传成功！")
        }
    }else if kind == "article" {
    form, err := c.MultipartForm()
	if err != nil {
		return err
	}
	files := form.File["img"]

	for _, file := range files {
		// Source
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		// Destination
		dst, err := os.Create("./images/"+file.Filename)
		if err != nil {
			return err
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			return err
		}else{
            return c.JSON(http.StatusOK, "上传成功！")
        }

	}
    }
    }else if act=="media"{
        
        file, err := c.FormFile("vid")
        fmt.Println(file.Filename)
        if err != nil {
            return err
        }
        src, err := file.Open()
        if err != nil {
            return err
        }
        defer src.Close()
    
        // Destination
        dst, err := os.Create("./media/"+file.Filename)
        if err != nil {
            return err
        }
        defer dst.Close()
        // Copy
        if _, err = io.Copy(dst, src); err != nil {
            return err
        }else{
            return c.JSON(http.StatusOK, "上传成功！")
        }
   }
   return c.JSON(http.StatusOK, "wrong")
    }
}
//删除cookie
func delCookie(c echo.Context) (err error){
    cookie := new(http.Cookie)      
    cookie.Name = "denglu"  
    cookie.MaxAge = -1        
    c.SetCookie(cookie)
    return c.JSON(http.StatusOK, "token已过期")
}
//发布功能
func send(c echo.Context) (err error) {
    cookie,err :=c.Cookie("denglu")
    if err != nil {return c.JSON(http.StatusOK, "未登录")}else{
        claims := parseJwt(cookie.Value)
        user_id  := claims["user_id"]
        if user_id =="expired" { 
           return delCookie(c)
        }
        // var userinfo User
        card:=new(Card)
        if err = c.Bind(card); err != nil {
            return c.JSON(http.StatusOK, "数据错误")
        }
        fmt.Println(card.Title,card.Message,card.Image,card.Video)
        db,err:=opendb(c)      //连接数据库 
        defer db.Close()    //关闭数据库
        if err!=nil {
        return err
        }
       
        id := time.Now().Unix()
        if card.Image != "" {
            card.Image = "images/"+card.Image
        }
        //card 分类处理
        if card.Video != "" { //文章  
            card.Video = "media/"+card.Video
        }            //课程
        db.Exec("insert into card_list(id,user_id,title,message,image,video,likes,kind) values (?,?,?,?,?,?,?,?)",id,user_id,card.Title,card.Message,card.Image,card.Video,0,card.Kind)     
        fmt.Println("发布成功！")
        resp := map[string]string{"message": "发布成功！"}
        return c.JSON(http.StatusOK, resp)
    }
}
//获取信息接口
func showEverthing(c echo.Context) error{
    cardList := c.QueryParam("cardlist")
    cardID := c.QueryParam("card")
    userID := c.QueryParam("people")
    resp := map[string]string{"message": "获取信息失败！"}
    db,err:=opendb(c)      //连接数据库
    if err!=nil {
        return err
    }
    defer db.Close() //关闭数据库
    if userID != "" {
    result:=db.QueryRow("select username,userimages,collects,follows from info where id=?",userID)      //单行查询用户基本信息
    var name,userimage,collects,follows string
    result.Scan(&name,&userimage,&collects,&follows)
    userimage = IP_URL+userimage
    collects =strings.TrimRight(collects,"|")
    collectsList := strings.Split(collects,"|")
    follows =strings.TrimRight(follows,"|")
    followsList := strings.Split(follows,"|")
    // fmt.Println(result)
    if name !="" {
        result,err := db.Query("select id,title,image,message,video,likes from card_list where user_id=?",userID)
        if err!=nil {
            return err
            }
               
    i :=0
    cards:=map[int]interface{}{}
    for result.Next(){        //循环显示所有的数据
        
        var id,title,image,message,video,likes string
        result.Scan(&id,&title,&image,&message,&video,&likes)
        image = IP_URL+image
        card:=map[string]interface{}{"id":id,"title":title,"message":message,"image":image,"video":video,"likes":likes}
        cards[i] = card
        i++ 
      
    }
    resp := map[string]interface{}{"name":name,"userimage":userimage,"cardsList":cards,"collects":collectsList,"follows":followsList}
    return c.JSON(http.StatusOK,resp)
    }
    }
    if cardList != "" {
        kind := c.QueryParam("kind")
        last := 0
        if cardList !="0" {
        cardList,_:= strconv.Atoi(cardList)
        last =cardList * 5 + 1
        }
            result,err := db.Query("select id from card_list limit ?,?",last,5)
            if kind =="article"{
                result,err = db.Query("select id from card_list where video='' limit ?,?",last,5)
            }else if kind == "video" {
                result,err = db.Query("select id from card_list where video<>'' limit ?,?",last,5)
            }else if kind == "hot" {
                result,err = db.Query("select id from card_list order by likes desc limit ?,?",last,5)
            }
            if err!=nil {
                return err
                }
            // fmt.Println(result)
        // columns, _ := result.Columns()
        // columnLength := len(columns)
        cards:=map[int]interface{}{}
        i :=0
        for result.Next(){        //循环显示所有的数据
         
            var id string
            result.Scan(&id)
            card:=map[string]interface{}{"id":id}
            cards[i] = card
            i++
        }
    // card:=map[string]interface{}{"id":id,"title":title,"message":message}
    // cards:=map[int]interface{}{1:card,2:card}
    resp := map[string]interface{}{"cards":cards}
    return c.JSON(http.StatusOK,resp)
      
    }
    if cardID !=""{
        result:= db.QueryRow("select id,title,image,message,video,user_id,likes,kind from card_list where id=? ",cardID)
        var id,title,image,message,video,user_id,likes,kind string
        result.Scan(&id,&title,&image,&message,&video,&user_id,&likes,&kind)
        likebool :=false
        collectbool :=false
        cookie,err:=c.Cookie("denglu")
        if err != nil {}else{
        claims := parseJwt(cookie.Value)
        userID :=claims["user_id"]
        result = db.QueryRow("select likes,collects from info where id=? ",userID)
        var userLikes,userCollects string
        result.Scan(&userLikes,&userCollects)
        likebool  = strings.Contains(userLikes, cardID)
        collectbool  = strings.Contains(userCollects, cardID)
    }
        if image !="" {
            image =IP_URL+image
        }
        if video !="" {
            video =IP_URL+video
        }
        res,err := db.Query("select content,author_id,datetime from comments where id=?",cardID)
        commits:=map[int]interface{}{}
        i :=0
        for res.Next(){        //循环显示所有的数据
         
            var comments,author_id,datetime string
            res.Scan(&comments,&author_id,&datetime)
            result = db.QueryRow("select username,userimages from info where id=? ",author_id)
            var username,userimages string
            result.Scan(&username,&userimages)
            comment :=map[string]string{"author":username,"avatar":IP_URL+userimages,"content":comments,"datetime":datetime}
            commits[i] = comment
            i++
        }
        cards:=map[string]interface{}{"id":id,"title":title,"message":message,"video":video,"image":image,"user_id":user_id,"likes":likes,"kind":kind}
        resp := map[string]interface{}{"cards":cards,"likes":likebool,"collects":collectbool,"comments":commits}
        return c.JSON(http.StatusOK,resp)
    }
    return c.JSON(http.StatusOK,resp)
}
//修改系统-修改文章-修改视频-修改个人信息
func edit(c echo.Context) error{
    cookie,err :=c.Cookie("denglu")
    cardID := c.QueryParam("card")
    if err != nil {return c.JSON(http.StatusOK, "未登录")}else{
        claims := parseJwt(cookie.Value)
        user_id  := claims["user_id"]
        if user_id =="expired" { 
           return delCookie(c)
        }
    if cardID == ""{
        user:=new(User)
        if err = c.Bind(user); err != nil {
            return c.JSON(http.StatusOK, "数据错误")
        }
        db,err:=opendb(c)      //连接数据库
        if err!=nil {
            return err
        }
        defer db.Close()
        fmt.Println(user.School)
        db.Exec("update info set username=?,school=? where id=?",user.Name,user.School,user_id)     
        fmt.Println("修改成功！")
        resp :=map[string]string{"message": "update successfully"}
        return c.JSON(http.StatusOK, resp)
    }else{
        card:=new(Card)
        if err = c.Bind(card); err != nil {
            return c.JSON(http.StatusOK, "数据错误")
        }
        fmt.Println(card.Title,card.Message,card.Image,card.Video)
        db,err:=opendb(c)      //连接数据库
        if err!=nil {
        return err
        }
        defer db.Close()    //关闭数据库
        if card.Image != "" {
            card.Image = "images/"+card.Image
        }
        //card 分类处理
        if card.Video != "" { //文章
            card.Video = "media/"+card.Video  
        }                   //课程  
        db.Exec("update card_list set user_id=?,title=?,message=?,image=?,video=? where id=?",user_id,card.Title,card.Message,card.Image,card.Video,cardID)  
        fmt.Println("修改成功！")
        resp := map[string]string{"message": "修改成功！"}
        return c.JSON(http.StatusOK, resp)
    }
    }
}
//用户操作功能-点赞-收藏-留言-关注
func doing(c echo.Context) error{
    likesID :=c.QueryParam("likes")
    collectID :=c.QueryParam("collects")
    followID :=c.QueryParam("follows")
    commitID :=c.QueryParam("commits")
    cookie,err :=c.Cookie("denglu")
    if err != nil {return c.JSON(http.StatusOK, "未登录")}else{
        claims := parseJwt(cookie.Value)
        user_id  := claims["user_id"]
        if user_id =="expired" { 
           return delCookie(c)
        }
        db,err:=opendb(c)      //连接数据库
            if err!=nil {
                return err
            }
        defer db.Close()
    if likesID !=""{
        sure := c.QueryParam("sure")
        if sure == "yes" {
            // fmt.Println("like")
            db.Exec("update info set likes=concat(`likes`,?) where id=?",likesID+"|",user_id)   
            db.Exec("update card_list set likes=`likes`+1 where id=?",likesID)   
            fmt.Println("操作成功！")
            resp :=map[string]string{"message": "操作成功！"}
            return c.JSON(http.StatusOK, resp)
        }
        if sure == "no" {
            db.Exec("update info set likes=replace(`likes`,?,'') where id=?",likesID+"|",user_id)   
            db.Exec("update card_list set likes=`likes`-1 where id=?",likesID)   
            fmt.Println("操作成功！")
            resp :=map[string]string{"message": "操作成功！"}
            return c.JSON(http.StatusOK, resp)
        }
    }
    if collectID !=""{
        sure := c.QueryParam("sure")
        if sure == "yes" {
            // fmt.Println("like")
            db.Exec("update info set collects=concat(`collects`,?) where id=?",collectID+"|",user_id)   
          
            fmt.Println("操作成功！")
            resp :=map[string]string{"message": "操作成功！"}
            return c.JSON(http.StatusOK, resp)
        }
        if sure == "no" {
            db.Exec("update info set collects=replace(`collects`,?,'') where id=?",collectID+"|",user_id)   

            fmt.Println("操作成功！")
            resp :=map[string]string{"message": "操作成功！"}
            return c.JSON(http.StatusOK, resp)
        }
    }
    if followID !=""{
        sure := c.QueryParam("sure")
        if sure == "yes" {
            // fmt.Println("like")
            db.Exec("update info set follows=concat(`follows`,?) where id=?",followID+"|",user_id)   
          
            fmt.Println("操作成功！")
            resp :=map[string]string{"message": "操作成功！"}
            return c.JSON(http.StatusOK, resp)
        }
        if sure == "no" {
            db.Exec("update info set follows=replace(`follows`,?,'') where id=?",followID+"|",user_id)   

            fmt.Println("操作成功！")
            resp :=map[string]string{"message": "操作成功！"}
            return c.JSON(http.StatusOK, resp)
        }
    }
    if commitID =="true"{
        comment :=new(Comment)
        if err = c.Bind(comment); err != nil {
            return c.JSON(http.StatusOK, "数据错误")
        }
        time := time.Now().Format("2006-01-02 15:04:05")
        db.Exec("insert into comments(id,author_id,datetime,content) values (?,?,?,?)",comment.Card_id,user_id,time,comment.Comments)     
        fmt.Println("操作成功！")
        resp := map[string]string{"message": "操作成功！"}
        return c.JSON(http.StatusOK, resp)
    }
    }
    return c.JSON(http.StatusOK, "wrong")
}
func search(c echo.Context) error{
    search := "%"+c.QueryParam("search")+"%"
    db,err:=opendb(c)      //连接数据库 
    defer db.Close()    //关闭数据库
    if err!=nil {
    return err
    }
    fmt.Println(search)
    result,err := db.Query("select id,title,user_id from card_list where title like ? or message like ? ",search,search)
        if err!=nil {
            return err
            }
               
    i :=0
    cards:=map[int]interface{}{}
    for result.Next(){        //循环显示所有的数据
        
        var id,title,user_id string
        result.Scan(&id,&title,&user_id)
        card:=map[string]interface{}{"id":id,"title":title,"user_id":user_id}
        cards[i] = card
        i++ 
    }
    resp := map[string]interface{}{"cards":cards}
    return c.JSON(http.StatusOK,resp)
}
//连接数据库
func opendb(c echo.Context) (*sql.DB ,error) {
    db,_:=sql.Open("mysql","root:xfz123456@(127.0.0.1:3306)/article") // 设置连接数据库的参数
      
        err:=db.Ping()      //连接数据库
        if err!=nil{
            fmt.Println("数据库连接失败")
            fmt.Println(err)
            return db,c.JSON(http.StatusOK, "数据库连接失败")
        }
        return db,err
}
func main() {
    e := echo.New()
    //跨域中间件
    e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
        AllowOrigins: []string{"http://127.0.0.1:3000"},
        AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,echo.HeaderXRequestedWith},
        AllowCredentials: true,
      }))
    e.POST("/zhuce", zhuce)            //注册路由
    e.POST("/denglu", denglu)           //登陆路由
    e.POST("/upload/:what",upload)   //上传路由
    e.POST("/send",send)           //发布card路由
    e.GET("/show",showEverthing)  //获取信息接口
    e.POST("/edit",edit)                 //修改路由
    e.POST("/doing",doing)              //用户操作路由-点赞-收藏-留言-关注
    e.GET("/search",search)    //查询搜索
    e.Static("/avatar","./avatar")    //用户头像资源
    e.Static("/images","./images")    //用户图片资源
    e.Static("/media","./media")    //用户视频资源
    
	e.Logger.Fatal(e.Start(":8000"))   //端口号8000
    
}

//创建 token
func createJwt(id string) (string, error) {
	//	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	//		"foo": "bar",
	//		"nbf": time.Date(2015, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),

	//	})
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["user_id"] = id 
	claims["exp"] = time.Now().Add(6*time.Hour * time.Duration(1)).Unix()
	claims["iat"] = time.Now().Unix()
	token.Claims = claims

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(SIGN_NAME_SCERET))
	return tokenString, err
}
//解析 token
func parseJwt(tokenString string) jwt.MapClaims {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(SIGN_NAME_SCERET), nil
	})

	var claims jwt.MapClaims
	var ok bool

	if claims, ok = token.Claims.(jwt.MapClaims); ok && token.Valid {
        // fmt.Println(claims["user_id"], claims["nbf"])
        return claims
	} else {
        fmt.Println(err)
        claims["user_id"]="expired" 
	}
	return claims
}
