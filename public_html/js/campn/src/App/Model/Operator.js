function Operator(name) {
        
    this._name = name;
    
    this.dataOperators = {
        equalsTo    : { text: "est égal à"                 , type: 'comparaison', shortText: "="                 , value: "equalsTo"     , hasValue: true,  notAvailableTypes: []},
        notEqualsTo : { text: "est différent de"           , type: 'comparaison', shortText: "différent de"      , value: "notEqualsTo"  , hasValue: true,  notAvailableTypes: []},
        greaterThan : { text: "est supérieur ou égal à"    , type: 'comparaison', shortText: ">="                , value: "greaterThan"  , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        sGreaterThan: { text: "est strictement supérieur à", type: 'comparaison', shortText: ">"                 , value: "sGreaterThan" , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        lessThan    : { text: "est inférieur à"            , type: 'comparaison', shortText: "<="                , value: "lessThan"     , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        sLessThan   : { text: "est strictement inférieur à", type: 'comparaison', shortText: "<"                 , value: "sLessThan"    , hasValue: true,  notAvailableTypes: ["link", "string", "boolean"] },
        isEmpty     : { text: "n'est pas renseigné"        , type: 'logic'      , shortText: "pas renseigné"     , value: "isEmpty"      , hasValue: false, notAvailableTypes: []},
        isNotEmpty  : { text: "est renseigné"              , type: 'logic'      , shortText: "renseigné"         , value: "isNotEmpty"   , hasValue: false, notAvailableTypes: []},
        contains    : { text: "contient"                   , type: 'comparaison', shortText: "contient"          , value: "contains"     , hasValue: true,  notAvailableTypes: ["link", "boolean", "integer"] },
        beginsWith  : { text: "commence par"               , type: 'comparaison', shortText: "commence par"      , value: "beginsWith"   , hasValue: true,  notAvailableTypes: ["link", "boolean", "integer"] },
        endsWith    : { text: "se termine par"             , type: 'comparaison', shortText: "se termine par"    , value: "endsWith"     , hasValue: true,  notAvailableTypes: ["link", "boolean", "integer"] },
        between     : { text: "est compris entre"          , type: 'interval'   , shortText: "compris entre"     , value: "between"      , hasValue: true,  notAvailableTypes: ["boolean"] },
        notBetween  : { text: "n'est pas compris entre"    , type: 'interval'   , shortText: "pas compris entre" , value: "notBetween"   , hasValue: true,  notAvailableTypes: ["boolean"] },
        in          : { text: "est compris dans"           , type: 'sequence'   , shortText: "compris dans"      , value: "in"           , hasValue: true,  notAvailableTypes: ["boolean"]},
        notIn       : { text: "n'est pas compris dans"     , type: 'sequence'   , shortText: "pas compris dans"  , value: "notIn"        , hasValue: true,  notAvailableTypes: ["boolean"]}
    };
    
    this.text = this.dataOperators[this._name].text;
    this.shortText = this.dataOperators[this._name].shorText;
    this.hasValue = this.dataOperators[this._name].hasValue;
    this.type = function() {
        return this.dataOperators[this._name].type;
    }
    this.notAvailableTypes = this.dataOperators[this._name].notAvailableTypes;
    
    this.name = function() {
        return this._name;
    }
    
}