/**
 * Represents a user object
 */
define([], function(){
    return function(data) {
        this.username = null;
        this.firstname = null;
        this.lastname = null;
        this.gender = null;
        this.bio = null;
        this.background = null;
        this.bgcreditname = null;
        this.bgcrediturl = null;
        this.points = null;
        this.titles = [];
        this.badges = [];
        this.streams = [];
        this.title = null;
        this.nexttitle = null;
        this.email = null;
        this.level = null;
        this.last = null;
        this.next = null;
        this.points = null;
        this.followers = null;
        this.following = null;
        this.emailhash = null;
        var badgeIndex = [
        {
            "id": 1,
            "name": "Freelance Journalist",
            "description": "Stream content later featured in a TV report",
            "secret": true
        },
        {
            "id": 2,
            "name": "Send it out there!",
            "description": "Streamed something"
        },
        {
            "id": 3,
            "name": "Well-watched",
            "description": "More than 100 views",
            "secret": true
        },
        {
            "id": 4,
            "name": "Broadcaster",
            "description": "More than 1,000 views",
            "secret": true
        },
        {
            "id": 5,
            "name": "Syndicate",
            "description": "More than 10,000 views",
            "secret": true
        },
        {
            "id": 6,
            "name": "TACOs",
            "description": "Emailed the Tacomaster",
            "secret": true
        },
        {
            "id": 7,
            "name": "Idea",
            "description": "Stream something revolutionary"
        },
        {
            "id": 8,
            "name": "Heavy",
            "description": "Stream something big and impactful"
        },
        {
            "id": 9,
            "name": "Internationalist",
            "description": "Stream something of international appeal"
        },
        {
            "id": 10,
            "name": "Lock Breaker",
            "description": "Stream something previously classified"
        },
        {
            "id": 11,
            "name": "Iron Sights",
            "description": "Many streams on a single subject which satisfy another blue badge"
        },
        {
            "id": 12,
            "name": "Sacrifice",
            "description": "Had a phone lost, broken, or stolen while streaming"
        },
        {
            "id": 13,
            "name": "\"Unlimited\"",
            "description": "Went over a data cap to stream"
        },
        {
            "id": 14,
            "name": "YC",
            "description": "Stream something YCombinator-related"
        },
        {
            "id": 15,
            "name": "pg",
            "description": "Stream Paul Graham"
        },
        {
            "id": 16,
            "name": "pb",
            "description": "Stream Paul Buchheit"
        },
        {
            "id": 17,
            "name": "Busy Man with Macbook",
            "description": "Stream Garry Tan"
        },
        {
            "id": 18,
            "name": "Beta",
            "description": "Helped test the TapIn.tv app",
            "secret": true
        },
        {
            "id": 19,
            "name": "Employee",
            "description": "TapIn.tv Employee",
            "secret": true
        },
        {
            "id": 20,
            "name": "Founder",
            "description": "Founded TapIn.tv",
            "secret": true
        },
        {
            "id": 21,
            "name": "Hackathon",
            "description": "Stream a hackathon"
        },
        {
            "id": 22,
            "name": "Coding Marathon",
            "description": "Stream a coding marathon"
        },
        {
            "id": 23,
            "name": "Tech Talk",
            "description": "Stream a technical presentation"
        },
        {
            "id": 24,
            "name": "Brogramming",
            "description": "Stream a brogrammer"
        },
        {
            "id": 25,
            "name": "Hacker House",
            "description": "Stream a hacker house"
        },
        {
            "id": 26,
            "name": "Startup Weekend",
            "description": "Stream from a Startup Weekend event"
        },
        {
            "id": 27,
            "name": "CodeDay",
            "description": "Stream from a CodeDay event"
        },
        {
            "id": 28,
            "name": "Extreme Weather",
            "description": "Stream extreme weather"
        },
        {
            "id": 29,
            "name": "Labcoat",
            "description": "Stream something of scientific note"
        },
        {
            "id": 30,
            "name": "Partier",
            "description": "Stream a party"
        },
        {
            "id": 31,
            "name": "Awards",
            "description": "Stream an awards ceremony"
        },
        {
            "id": 32,
            "name": "Backstage",
            "description": "Stream something exclusive or behind-the-scenes"
        },
        {
            "id": 33,
            "name": "Documentarian",
            "description": "Multiple streams of the same location"
        },
        {
            "id": 34,
            "name": "Early Riser",
            "description": "Stream between 4-6am"
        },
        {
            "id": 35,
            "name": "Snow",
            "description": "Stream snow"
        },
        {
            "id": 36,
            "name": "Wait for it...",
            "description": "Long stream with the action at the end"
        },
        {
            "id": 37,
            "name": "Stop! Thief!",
            "description": "Catch a thief on stream"
        },
        {
            "id": 38,
            "name": "Rockstar",
            "description": "Stream a world-famous musician"
        },
        {
            "id": 39,
            "name": "Busker",
            "description": "Stream a busker"
        },
        {
            "id":40,
            "name": "Testing, testing, 1, 2, 3",
            "description": "Made a test stream"
        }
    ]

        /**
         * Returns the display name of the user
         * @return string The display name of the user, one of: [first name] [last name], [first name] "[username]", or [username]
         */
        this.getName = function() {
            var name = "";
            if (this.firstname !== null && this.firstname != '') {
                name += this.firstname;
                if (this.lastname !== null && this.lastname != '') {
                    name += ' ' + this.lastname;
                } else {
                    name += ' "' + this.username + '"';
                }
            } else {
                name = this.username;
            }

            return name;
        }

        this.getAvatar = function(size) {
            return 'http://www.gravatar.com/avatar/' + this.emailhash + '?r=pg&s=' + size + '&d=http%3A%2F%2Fwww.tapin.tv%2Fassets%2Fimg%2Ficon-noavatar-' + size + '.png';
        }

        this.getAvatar50 = function()
        {
            return this.getAvatar(50);
        }

        this.getAvatar35 = function()
        {
            return this.getAvatar(35);
        }

        /**
         * Returns the level percent of the user
         * @return float Percent to the next level
         */
        this.getLevelPercent = function() {
            return (100 * (this.points - this.last))/(this.next - this.last);
        }

        /**
         * Returns the width of the level bar (1.5x the percent)
         * @return float Width of the level bar, with 150 max
         */
        this.getLevelBarWidth = function() {
            var r = Math.floor(1.5 * this.getLevelPercent())
            return (r<0)?0:r;
        }

        /**
         * Returns the background URL
         * @return string URL of the background
         */
        this.getBackgroundUrl = function() {
            if (this.background === null || this.background == '' || this.background.substring(0, 7) == 'http://') {
                return this.background;
            } else {
                return 'assets/img/backgrounds/' + this.background;
            }
        }

        /**
         * Returns a scaled version of the background URL if possible, otherwise the full background URL
         * @return string URL of the background
         */
        this.getSmallBackgroundUrl = function() {
            if (this.background === null || this.background == '' || this.background.substring(0, 7) == 'http://') {
                return this.background;
            } else {
                return 'assets/img/backgrounds/small/' + this.background;
            }
        }

        /**
         * Populates the object with userdata
         * @param  object   data Key-value pair of user data
         */
        this.constructor = function(data)
        {
            for (var key in data) {
                if (key in this) {
                    this[key] = data[key];
                }
                if(key == 'badge'){
                    for(i in data[key]){
                        _id = parseInt(data[key][i])-1;
                        this.badges.push({id: _id+1, name: badgeIndex[_id]['name'], description: badgeIndex[_id]['description']})
                    }
                }
            }
        }
        this.constructor(data);
    }
})