function uid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

function clone(srcInstance) {
  
    if(typeof(srcInstance) != 'object' || srcInstance == null){
        return srcInstance;
    }
    var newInstance = new srcInstance.constructor();
    for(var i in srcInstance) {
        newInstance[i] = clone(srcInstance[i]);
    }
    return newInstance;
}

$.fn.exists = function() {
    return this.length > 0;
}

$.fn.pos = function(w, px) {
    if (this.exists()) {
        if (px == null) {
            return parseInt($(this).css(w).toString().replace('px',''));
        } else {
            $(this).css(w, parseInt(px)+'px');    
            return this;
        }
    } else {
        return this;
    }
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
};

Array.prototype.unset = function(index){
    var output = this.slice(0,index);
    for (var i=index+1; i<this.length; i++) {
        output.push(this[i]);
    }
    return output;
}

Array.prototype.insert = function(index, value) {          
    var output = this.slice(0,index+1);
    output.push(value);
    /*output = output.concat(this.slice(index+1,this.length));
    return output;*/
    return output.concat(this.slice(index+1,this.length));
}
