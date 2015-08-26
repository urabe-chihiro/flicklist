function AbuiFlickmenu(_options){
  this.wrapperElements =  _options.wrapperElements;
  this.flickElements = $(this.wrapperElements).find('.flick-li');
  this.flickContentsList = []; //フリックcontent を格納
  this.pane_count = 3;
  this.pane_width = 0;
  this.remit = 200;
  this.swipe = null;
  this.hammertime = {}; 

  this.init();
};

AbuiFlickmenu.prototype.init = function(){
  //DOMを格納
  this.setFlickContentsList();
  //レイアウトをセット
  this.setFlickLayout();
  //hammerJS をセット
  this.registerHammer();
};

AbuiFlickmenu.prototype.setFlickContentsList =  function(){
  var self = this;
  $(this.flickElements).each(function(i,flickLi){
    self.flickContentsList.push({
      readed: false,
      id: 'flick-li_' + i,
      content: flickLi,
      container: $(flickLi).find('ul'),
      panes: $(flickLi).find('li')
    });
  });
};

AbuiFlickmenu.prototype.resetData = function(id,readed){
  console.log(readed);

  $(this.flickContentsList).each(function(i,obj){
    if(obj.id == id){
      obj.readed =  readed;
    };
  });
};

AbuiFlickmenu.prototype.returnReadStatus = function(id){
  var readed;
  $(this.flickContentsList).each(function(i,obj){
    if(obj.id == id){
      readed = obj.readed;
    }; 
  });
  return readed;
}

AbuiFlickmenu.prototype.changeReadBackground =  function(){
  $(this.flickContentsList).each(function(i,obj){
    if(obj.readed){
      $(obj.content).addClass('flick-li--readed');
    } else {
      $(obj.content).removeClass('flick-li--readed');
    };
  });
};

AbuiFlickmenu.prototype.setFlickLayout = function(){
  var self = this;
  $(this.flickContentsList).each(function(i,obj){
  
    $(obj.content).attr('id', 'flick-li_' + i);
    
    self.pane_width = obj.content.offsetWidth;
    
    $(obj.panes).each(function(i,pan){
      $(pan).css({
        width: self.pane_width +  'px'
      });
    });
    $(obj.container).css({
      width: self.pane_width *  self.pane_count + 'px',
      '-webkit-transform': 'translate(' + self.pane_width * -1 + 'px,0)' 
    });
  });
};

AbuiFlickmenu.prototype.setContainerOffset =  function(target,px,animate){
  
  var container =  $(target).parents('ul'),
      self =  this;
  container.removeClass('animate');
  
  if(animate){
    container.addClass('animate');
  };
  container.css({
    '-webkit-transform': 'translate(' + px + 'px,0)'
  });  
};

AbuiFlickmenu.prototype.registerHammer  =  function(){
  var self =  this;
  $(this.flickContentsList).each(function(i,obj){
    self.hammertime = new window.Hammer(obj.content,{
      dragLockToAxis: true,
      dragBlockHorizontal: true,
      gesture: true
    });
    self.hammertime.on('release dragleft dragright swipeleft swiperight',function(ev){
        self.hammerHandler(ev,self);
    });
  });
};

AbuiFlickmenu.prototype.hammerHandler =  function(ev,self){
  var self = this;
  var content = $(ev.target).parents('.flick-li');
  ev.gesture.preventDefault();

  console.log(ev.type);

  switch(ev.type){
    case 'dragleft':
      if(!this.returnReadStatus(content.attr('id'))){
        //remit 超えたら戻る
        if(ev.gesture.deltaX < this.remit * -1){
          return;
        };
        self.setContainerOffset(ev.gesture.target,ev.gesture.deltaX + self.pane_width * -1,true);

        //既読ステータスを保存
        if(ev.gesture.deltaX < -100){
          self.setReadStatus(content);
        };
      };
    break;

    case 'dragright':
      //既読だったらフリックできる
      if(this.returnReadStatus(content.attr('id'))){
        //remit 超えたら戻る
        if(ev.gesture.deltaX > this.remit){
          return;
        };
        self.setContainerOffset(ev.gesture.target,ev.gesture.deltaX - self.pane_width,true);

        $(content).find('ul').on('webkitTransitionEnd',function(){
          self.resetData(content.attr('id'),false);
          self.changeReadBackground();
          $(this).off('webkitTransitionEnd');
        });
      };
    break;

    case 'swipeleft':
      //既読じゃなかったらフリックできる
      if(!this.returnReadStatus(content.attr('id'))){ 
        this.swipe = ev.type;
        self.setContainerOffset(ev.gesture.target,(self.remit + self.pane_width) * -1,true);

        //既読ステータスを保存
        if(ev.gesture.deltaX < -100){
          self.setReadStatus(content);
        };
      };  
    break;

    case 'swiperight':
      //既読だったらフリックできる
      if(this.returnReadStatus(content.attr('id'))){ 
        this.swipe = ev.type;
        self.setContainerOffset(ev.gesture.target,self.remit - self.pane_width,true);

        $(content).find('ul').on('webkitTransitionEnd',function(){
          self.resetData(content.attr('id'),false);
          self.changeReadBackground();
          $(this).off('webkitTransitionEnd');
        });
      };  
    break;

    case 'release':
        if(this.swipe){
          setTimeout(function(){
            self.setContainerOffset(ev.gesture.target,self.pane_width * -1 ,true);
            self.swipe = null;
          },200);
        } else {
          self.setContainerOffset(ev.gesture.target,self.pane_width * -1,true);
        }
    break;
  };

  AbuiFlickmenu.prototype.setReadStatus = function(content){
    $(content).find('ul').on('webkitTransitionEnd',function(){
      self.resetData(content.attr('id'),true);
      self.changeReadBackground();
      $(this).off('webkitTransitionEnd');
    });
  }

  
};

