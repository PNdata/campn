function TypeFunction(type, name) {
        
    this._type = type;
    this._name = name;
    
    this.dataTypeFunctions = {
        date: {
            dayOfWeek  : { text: 'Jour de la semaine' , shortText: 'Jour de la semaine' , value: 'dayOfWeek'  , returnType: 'integer', formula: 'dayOfWeek({0})'  , label: 'Jour de la semaine de {0}'   },
            dayOfMonth : { text: 'Jour du mois'       , shortText: 'Jour du mois'       , value: 'dayOfMonth' , returnType: 'integer', formula: 'dayOfMonth({0})' , label: 'Jour du mois de {0}'         },
            dayOfYear  : { text: 'Jour de l\'année'   , shortText: 'Jour de l\'année'   , value: 'dayOfYear'  , returnType: 'integer', formula: 'dayOfYear({0})'  , label: 'Jour de l\'année de {0}'     },
            weekOfYear : { text: 'Semaine de l\'année', shortText: 'Semaine de l\'année', value: 'weekOfYear' , returnType: 'integer', formula: 'weekOfYear({0})' , label: 'Semaine de l\'année de {0}'  },
            monthOfYear: { text: 'Mois de l\'année'   , shortText: 'Mois de l\'année'   , value: 'monthOfYear', returnType: 'integer', formula: 'monthOfYear({0})', label: 'Mois de l\'année de {0}'     },
            ageInDay   : { text: 'Age en jours'       , shortText: 'Age en jours'       , value: 'ageInDay'   , returnType: 'integer', formula: 'ageInDay({0})'   , label: 'Age en jours de {0}'         },
            ageInMonth : { text: 'Age en mois'        , shortText: 'Age en mois'        , value: 'ageInMonth' , returnType: 'integer', formula: 'ageInMonth({0})' , label: 'Age en mois de {0}'          },
            ageInYear  : { text: 'Age en années'      , shortText: 'Age en années'      , value: 'ageInYear'  , returnType: 'integer', formula: 'ageInYear({0})'  , label: 'Age en année de {0}'         },
            year       : { text: 'Année'   			  , shortText: 'Année'   			, value: 'year'	      , returnType: 'integer', formula: 'year({0})'		  , label: 'Année de {0}'		         },
        }
    };
    
    this.text = this.dataTypeFunctions[this._type][this._name].text;
    this.shortText = this.dataTypeFunctions[this._type][this._name].shorText;
    this.value = this.dataTypeFunctions[this._type][this._name].value;
    this.returnType = this.dataTypeFunctions[this._type][this._name].returnType;
    this.formula = this.dataTypeFunctions[this._type][this._name].formula;
    this.label = this.dataTypeFunctions[this._type][this._name].label;
    
    this.name = function() {
        return this._name;
    }
    
    this.type = function() {
        return this._type;
    }
    
}