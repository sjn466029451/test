var express=require("express");
var app=express();
app.set("port",process.env.PORT || 3000);

var fortune=require("express/lib/fortune.js");

//设置handlebars视图引擎
var handlebars=require("express3-handlebars").create({defaultLayout:"main"});
app.engine("handlebars",handlebars.engine);
app.set("view engine","handlebars");
//app.set("views","./views/pages")
app.use(express.static(__dirname+"/public"));

app.use(function(req,res,next){
	res.locals.showTests=app.get("env") !== "production" && req.query.test==="1";
	next();
})


app.get("/",function(req,res){
	res.render("home");
});

app.get("/about/",function(req,res){
	
	res.render("about",{
		fortune:fortune.getFortune(),
		pageTestScript:"/qa/tests-about.js"
	});
});



//定制404页面
app.use(function(req,res){
	
	res.status(404);
	res.render("404");
});

//定制500页面
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render("500");
});
/*天气数据*/
function getWeatherData(){
	return {
		locations:[
			{
				name:"Portland",
				forecastUrl:"http:www.1.com",
				iconUrl:"http:www.1-1.com",
				weather:"Overcast",
				temp:"54.1 F (12.3 C)"
			},
			{
				name:"Bend",
				forecastUrl:"http:www.2.com",
				iconUrl:"http:www.2-1.com",
				weather:"Overcast",
				temp:"55.0 F (12.8 C)"
			},
			{
				name:"Manzanita",
				forecastUrl:"http:www.3.com",
				iconUrl:"http:www.3-1.com",
				weather:"Light Rain",
				temp:"55.0 F (12.8 C)"
			}
		]
	};
};
/*天气*/
app.use(function(req,res,next){
	
	if(!res.locals.partials){
		res.locals.partials={};
	}
	res.locals.partials.weather=getWeatherData();
	
	next();
	
});



app.listen(app.get("port"),function(){
	console.log("express started"+app.get("port")+";press")
});
