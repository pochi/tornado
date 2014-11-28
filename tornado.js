var Sensors = new Meteor.Collection("sensors");

Router.route('/', function() {
  //this.render("home");
});

Router.route('/current', function() {
  var result;
  for(var key in this.params.query) {
    result = key;
  }

  var split_result = result.split("_");
  var time = split_result[0];
  var voltage = split_result[1];
  var voltage_flag = split_result[2];
  var motion_flag = split_result[3];

  result = {time: time,
            voltage: voltage,
            voltage_flag: voltage_flag,
            motion: motion_flag};
  console.log(result);
  // クラウド環境におこられないよう、データは30件のみ持つものとする
  Sensors.insert(result, function(err, _) {
    var sensor_length = Sensors.find({}).fetch().length;
    if(sensor_length > 30) {
      var r = Sensors.findOne({});
      Sensors.remove({_id: r._id});
    }
  });
  this.response.writeHead(200, {"Content-Type": "application/json"});
  this.response.end("Save result");
}, {where: "server"});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Template.home.sensors = function() {
    return Sensors.find({}, {sort:{time:-1}});
  };

}
