function Operation(name) {
        
    this._name = name;
    
    this.dataOperations = {
        exists            : { text: 'Aucune'         , shortText: 'Aucune'    , value: 'exists'            },
        sum               : { text: 'Somme / Total'  , shortText: 'Somme'     , value: 'sum'               },
        average           : { text: 'Moyenne'        , shortText: 'Moyenne'   , value: 'average'           },
        standartDeviation : { text: 'Ecart-type'     , shortText: 'Ecart-type', value: 'standartDeviation' },
        minimal           : { text: 'Valeur minimale', shortText: 'Minimum'   , value: 'minimum'           },
        maximal           : { text: 'Valeur maximale', shortText: 'Maximum'   , value: 'maximum'           },
        count             : { text: 'Nombre'         , shortText: 'Nombre'    , value: 'count'             }
    }
    
    this.text = this.dataOperations[this._name].text;
    this.shortText = this.dataOperations[this._name].shorText;
    
    this.name = function() {
        return this._name;
    }
    
}