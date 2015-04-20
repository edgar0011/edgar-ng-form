angular.module("ed.ui", ["ed.ui.services", "ed.ui.directives", 'ed.navigation', 'ed.messaging'])

.constant('edCoreEvents', {

    'DATA_LOADING': 'edDataLoading',
    'DATA_LOADED': 'edDataLoaded',
    'DATA_LOAD_ERROR': 'edDataLoadError'

})

.constant('edCoreConstants', {
    'errorMessage': {
        'DEFAULT_TEXT': 'Error'
    },
    'errorMessageContexts': {
        'ROUTE': 'route',
        'SERVER': 'server',
        'RESPONSE_DATA': 'responseData',
        'USER': 'user',
        'VALIDATION': 'validation'
    },
    'httpCommunication': {
        'status': {
            'NOT_FOUND': 404,
            'FORBIDDEN': 403,
            'UNAUTHORIZED': 401,
            'BAD_REQUEST': 400,
            'OK': 200
        }
    },
    'ui': {
        SCROLL_UP_DELAY: 600,
        SCROLL_UP_OFFSET: 0,
        BLOCKER_OFF_DELAY: 300
    }
})

.value('edCommonProperties', {
    "selectedLanguage": 'ed',
    "language": {
        "cs": {
            "months": [
                "leden",
                "únor",
                "březen",
                "duben",
                "květen",
                "červen",
                "červenec",
                "srpen",
                "září",
                "říjen",
                "listopad",
                "prosinec"
            ],
            "monthsShort": [
                "led",
                "úno",
                "bře",
                "dub",
                "kvě",
                "čvn",
                "čvc",
                "srp",
                "zář",
                "říj",
                "lis",
                "pro"
            ],
            "weekdays": [
                "neděle",
                "pondělí",
                "úterý",
                "středa",
                "čtvrtek",
                "pátek",
                "sobota"
            ],
            "weekdaysShort": [
                "ne",
                "po",
                "út",
                "st",
                "čt",
                "pá",
                "so"
            ],
            "weekdaysMin": [
                "ne",
                "po",
                "út",
                "st",
                "čt",
                "pá",
                "so"
            ],
            "longDateFormat": {
                "LT": "H:mm",
                "L": "DD.MM.YYYY",
                "LL": "D. MMMM YYYY",
                "LLL": "D. MMMM YYYY LT",
                "LLLL": "dddd D. MMMM YYYY LT"
            },
            "calendar": {
                "sameDay": "[dnes v] LT",
                "nextDay": "[zítra v] LT",
                "nextWeek": "[příští týden v] LT",
                "lastDay": "[včera v] LT",
                "lastWeek": "[minulý týden v] LT",
                "sameElse": "L"
            },
            "relativeTime": {
                "future": "za %s",
                "past": "před %s"
            },
            "abbr": "cs",
            "week": {
                "dow": 1,
                "doy": 4
            }
        },
        "fr": {
            "months": [
                "janvier",
                "février",
                "mars",
                "avril",
                "mai",
                "juin",
                "juillet",
                "août",
                "septembre",
                "octobre",
                "novembre",
                "décembre"
            ],
            "monthsShort": [
                "janv.",
                "févr.",
                "mars",
                "avr.",
                "mai",
                "juin",
                "juil.",
                "août",
                "sept.",
                "oct.",
                "nov.",
                "déc."
            ],
            "weekdays": [
                "dimanche",
                "lundi",
                "mardi",
                "mercredi",
                "jeudi",
                "vendredi",
                "samedi"
            ],
            "weekdaysShort": [
                "dim.",
                "lun.",
                "mar.",
                "mer.",
                "jeu.",
                "ven.",
                "sam."
            ],
            "weekdaysMin": [
                "Di",
                "Lu",
                "Ma",
                "Me",
                "Je",
                "Ve",
                "Sa"
            ],
            "longDateFormat": {
                "LT": "HH:mm",
                "LTS": "HH:mm:ss",
                "L": "DD/MM/YYYY",
                "LL": "D MMMM YYYY",
                "LLL": "D MMMM YYYY LT",
                "LLLL": "dddd D MMMM YYYY LT"
            },
            "calendar": {
                "sameDay": "[Aujourd'à] LT ",
                "nextDay": "[Demain à] LT",
                "nextWeek": "dddd [à] LT",
                "lastDay": "[Hier à] LT",
                "lastWeek": "dddd [dernier à] LT",
                "sameElse": "L"
            },
            "relativeTime": {
                "future": "dans %s",
                "past": "il y a %s",
                "s": "quelques secondes",
                "m": "une minute",
                "mm": "%d minutes",
                "h": "une heure",
                "hh": "%d heures",
                "d": "un jour",
                "dd": "%d jours",
                "M": "un mois",
                "MM": "%d mois",
                "y": "une année",
                "yy": "%d années"
            },
            "week": {
                "dow": 1,
                "doy": 4
            }
        }
    }
})

.factory("lodash", function($window) {

    var lodash = $window._;

    delete $window._;

    return lodash;

})

.run(function(lodash) {

    //alert(lodash);

});

angular.module("ed.ui.services", []);

angular.module("ed.ui.directives", []);

angular.module("ed.ui.directives", []);
