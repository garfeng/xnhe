  isYm(s){
    return s == "a" || s == "o" || s == "e" || s == "i" || s =="u" || s == "v";
  }

  spxh(s){
    if(s.length == 1){
      return s.toUpperCase();
    } else {
      return xnheMap[s];
    }
  }

  parseXnhe(){
    let dict_xnhe = {};
    let dict_xnhe2 = {
    };

    for (let key in Dict){
      let s,m;
      if (key.length ==1){
        s = key;
        m = key;
      } else if (key.length == 2) {
        s = key[0];
        m = key[1];
      } else {
        if(key[1] == "h"){
          s = key.substr(0,2);
          m = key.substr(2);
        } else {
          s = key.substr(0,1);
          if(this.isYm(s)){
            m = key;
          } else {
            m = key.substr(1);
          }
        }
      }
      dict_xnhe[key] = this.spxh(s)+this.spxh(m);
    }
      console.log(JSON.stringify(dict_xnhe));
  }
