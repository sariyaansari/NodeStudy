var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/local-association-database.sqlite'
});

var dealer = sequelize.define('dealer', {
  companyname: {},
  contactperson: {},
  address1: {},
  address2: {},
  city: {},
  state: {},
  country: {},
  bankaccountno: {},
  bankaccountname: {},
  ifsccode: {},
  branchcode: {},
});

var driverpersonal = sequelize.define('driverpersonal', {
  drivername: {},
  address1: {},
  address2: {},
  city: {},
  state: {},
  country: {},
  licensenumber: {},
  licenseimagepath: {},
  profileimagepath: {},
  mobile: {},
  alternatemobile: {},
  email: {},
  worktype: {} //daytime, evening, 24X7
});

var vehicle = sequelize.define('vehicle',{
  vehicleregid: {},
  vehicletype: {},
  vehiclename: {},
  registrationimage: {},
  insurancecopy: {},
  pollutioncopy: {},
  vehiclefueltype: {}
});

var driverbankinfo = sequelize.define('driverbankinfo', {
  bankaccountno: {},
  bankaccountname: {},
  ifsccode: {},
  branchcode: {},
});

var driverservicearea = sequelize.define('driverservicearea', {
  servicearea: {},
  servicecity: {},
  serviceareafrom: {},
  serviceareato: {}
});

var travelcost = sequelize.define('travelcost', {
  chargesperkm: {},
  city: {},
  nightcharges: {},
  termsandconditions: {},
  waitingcharges: {}
});

var driverbookingstatus = sequelize.define('driverbookingstatus', {
  bookingstarttime: {},
  bookingstoptimeexpected: {},
  bookingstatus: {}
});

var customer = sequelize.define('customer', {
  name: {},
  email: {},
  mobile: {},
  address: {},
  city: {},
  state: {},
  country: {},
  emergencycontact: {}
});

var customerfavourites = sequelize.define('customerfavourites', {
  address: {},
  city: {},
  state: {},
  country: {}
});

var customerbooking = sequelize.define('customerbooking', {
  travellerName: {},
  contactphone: {},
  pickuplocation: {},
  droplocation: {},
  pickupdatetime: {},
  dropdatetime: {}
});

var companytermsconditions = sequelize.define('companytermsconditions', {
  companytnc: {},
});



sequelize.sync({force: true}).then(function(){
  console.log('DB Created');
});
