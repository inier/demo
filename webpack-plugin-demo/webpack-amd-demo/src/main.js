require.config({
    paths:{
        cat:'./cat.js'
    }
});

require(['cat'], function(cat) {
    var txt = cat.sayHello();
    document.getElementById('main').innerHTML = txt;
  });