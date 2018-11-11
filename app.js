var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var bodyParser = require('body-parser');

const port = process.env.port || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
	extended: true
}));


//mongoose connection

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo', {
	useNewUrlParser: true
}).catch((e)=>{
	console.log("Mongoose DB not connected");
});

//mongoose schema

var todoschema = new mongoose.Schema({
	name: String,
	like: {type:Number, default: 0},
	dislike: {type:Number, default: 0} 
});
var actionschema = new mongoose.Schema({
	name: String,
	like: {type:Number, default: 0},
	dislike: {type:Number, default: 0}
});
var apprecschema = new mongoose.Schema({
	name: String,
	like: {type:Number, default: 0},
	dislike: {type:Number, default: 0}
});

var todo = mongoose.model("todo", todoschema);
var action = mongoose.model("action", actionschema);
var apprec = mongoose.model("apprec", apprecschema);
var inc =0;
var dec=0;

app.get('/', (req, res) => {
	todo.find({}, (err, todolist) => {
		action.find({}, (err, actionlist) => {
			apprec.find({}, (err, appreclist) => {
				res.render('index.ejs', {
					todolist: todolist,
					actionlist: actionlist,
					appreclist: appreclist
				});
			});
		});
	}).catch((e)=>{
        console.log(e);
	}); 

});


app.post('/newtodo', (req, res) => {
	console.log('Item Submitted');
	var newitem = new todo({
		name: req.body.item1
	});
	var newitem1 = new action({
		name: req.body.item3
	});
	var newitem2 = new action({
		name: req.body.item5
	});
	if (req.body.item1 != undefined) {
		todo.create(newitem, (err, todo) => {
			if (err) console.log(err)
			else {}
		});
	} else {};
	if (req.body.item3 != undefined) {
		action.create(newitem1, (err, action) => {
			if (err) console.log(err)
			else {}
		});
	} else {};
	res.redirect('/');
	if (req.body.item5 != undefined) {
		apprec.create(newitem2, (err, apprec) => {
			if (err) console.log(err)
			else {}
		});
	} else {};
	res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
	var id = req.params.id;

	todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			console.log('no error');
		}
		res.redirect('/');
	}).catch((e)=>{
		console.log("Error in delete route"+ e);
	});

	action.findByIdAndRemove(id).then((action) => {
		if (!action) {
			console.log('no error');
		}
		res.redirect('/');
	}).catch((e)=>{
		console.log("Error in delete route");
	});
	apprec.findByIdAndRemove(id).then((apprec) => {
		if (!apprec) {
			console.log('no error');
		}
		res.redirect('/');
	}).catch((e)=>{
		console.log("Error in delete route");
	});


});

app.post('/like/:id', (req,res) => {
	var id = req.params.id;
	 inc += parseFloat(req.body.changeBy);
	 todo.findByIdAndUpdate(id, {
		$set: {
			like: inc
		}
	}, {
		new: true
	}).then((todo) => {
        
	});

});

app.post('/update/:id', (req, res) => {
	var id = req.params.id;
	console.log(req.body.item);
	var body = req.body.item;
	var body1 = req.body.item2;
	var body2 = req.body.item4;


	todo.findByIdAndUpdate(id, {
		$set: {
			name: body
		}
	}, {
		new: true
	}).then((todo) => {

		res.redirect('/');
	});

	action.findByIdAndUpdate(id, {
		$set: {
			name: body1
		}
	}, {
		new: true
	}).then((action) => {

		res.redirect('/');
	});

	apprec.findByIdAndUpdate(id, {
		$set: {
			name: body2
		}
	}, {
		new: true
	}).then((apprec) => {

		res.redirect('/');
	});

});




//catching routes

app.get('/*', (req, res) => {

	res.send('<h1>Invalid Page</h1>');
});

app.listen(port, () => {

	console.log(`Listening on port ${port} ......`);
});