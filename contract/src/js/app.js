App = {
  web3Provider: null,
  contracts: {},
  instance: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the tesstRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Loyalty.json', function(dataLoyalty) {
      App.contracts.Loyalty = TruffleContract(dataLoyalty);
      App.contracts.Loyalty.setProvider(App.web3Provider);
      App.contracts.Loyalty.deployed().then(function(ins) {
        instance = ins;
        //
        App.getToken();
        App.getInfo();
      });
      web3.eth.getAccounts(function(error, accounts) {
        if(error) console.log(error);
        web3.eth.getBalance(accounts[0],function(err, result){
          if(!err){
            let amount = web3.fromWei(result.toNumber(), "ether");
            $("#divInfo").append("<div>Hello "+accounts[0]+". You have "+amount+" ether</div>");
            App.loadData(accounts[0]);
          }
        });
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $('#aBuy').bind("click", App.buyToken);
    $('#aSell').bind("click", App.sellToken);
    $('#aIssue').bind("click", App.issueToken);
    $('#aIssueNew').bind("click", App.issueTokenNewUser);
    $('#aRedeem').bind("click", App.redeem);
    $('#aGetbalance').bind("click", App.getBalance);
  },

  buyToken: function(){
    let amount = parseInt($('#inputBuy').val()) / 10000;

    web3.eth.sendTransaction(
      {to: instance.address, value: web3.toWei(amount,"ether") }, 
      function(err, transactionHash) {
        if (!err){
          location.reload();
        }
      }
    );    
  },

  sellToken: function(){
    let amount = parseInt($('#inputSell').val());
    instance.merchantRedeemToken(amount, {gas:300000}).then(function(data){
      console.log(data);
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  issueToken: function(){
    let amount = parseInt($('#inputIssueAmount').val());
    let uid = $('#inputIssueScan').val();
    instance.updateUser(uid, amount).then(function(data){
      console.log(JSON.stringify(data));
    });   

  },

  issueTokenNewUser: function(){
    let amount = parseInt($('#inputIssueAmountNew').val());
    let uid = $('#inputIssueScan').val();
    let password = parseInt($('#inputNewUserPassword').val());
    instance.createUser(amount, password, Math.round(Math.random()*100000)).then(function(data){
      $('#qrcode').empty();
      $('#qrcode').qrcode(JSON.stringify(data.logs[0].args.uid));
    });   
  },

  getToken: function(){
    instance.merchantGetToken().then((data)=>{
      // console.log(parseInt(data));
      $("#divTokenInfo").html("<strong>You have "+parseInt(data)+" tokens!");
    }).catch(function(err){
      $("#divTokenInfo").html("<strong>You don't have any accounts yet. Please buy your first token to continue.</strong>");
    })
  },

  redeem: function(){
    let amount = parseInt($('#inputAmountRedeem').val());
    var info = $('#inputRedeemInfo').val();
    if(info.substring(info.length-1,info.length)==",")
      info=info.substring(0,info.length-1);
    info = info.split(',')+"";
    info = info.replace(/\"/g,"").split(",");
    var uids = [];
    var upwds = []; 
    for(i=0;i<info.length;i++){
      if(i%2==0)
        uids.push(info[i]);
      else
        upwds.push(info[i]);
    }
    console.log(uids);
    console.log(upwds);
    instance.useToken(uids, upwds, amount, {gas:300000}).catch(function(err) {
      console.log(err.message);
    });

  },

  // getBalance:function(){
  //   var uids = $('#inputUserBalance').val().split(',')+"";
  //   uids = uids.split(",");
  //   var total = 0;

  //   for(i=0;i<uids.length;i++){
  //     if(uids[i].length>0){


  //       jQuery.get('data/'+uids[i]+'.txt', function(data) {
  //         total+=parseInt(data);
  //       });

  //     }      
  //   }
  // },

  loadData: function(user) {
    App.contracts.Loyalty.deployed().then(function(instance) {
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getInfo: function(){
    instance.getUsers().then((data)=>{
      console.log(JSON.stringify(data));
    });
    instance.getMerchants().then((data)=>{
      console.log(JSON.stringify(data));
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});





///------------------------------------------------------------------------------------------------



var app2 = new Vue({
  el: '#app2',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {

      console.log(content);
      $('#inputRedeemInfo').val(content);
      
      self.scans.unshift({ date: +(Date.now()), content: content });
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});